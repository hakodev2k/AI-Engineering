#!/usr/bin/env python3
import argparse, json, shlex, statistics, subprocess, sys, time
from pathlib import Path


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def render(template, params):
    rendered = template
    for key, value in params.items():
        rendered = rendered.replace("{" + key + "}", str(value))
    if "{" in rendered or "}" in rendered:
        raise ValueError("unresolved placeholder remains in command template")
    return rendered


def run_once(command, timeout):
    started = time.perf_counter()
    p = subprocess.run(shlex.split(command), capture_output=True, text=True, timeout=timeout)
    elapsed_ms = (time.perf_counter() - started) * 1000.0
    return p.returncode, elapsed_ms, p.stdout, p.stderr


def main():
    ap = argparse.ArgumentParser(description="Benchmark parameter classes without mutating database state.")
    ap.add_argument("--cases", required=True, help="JSON file: {query_id, cases:[{name,params,expected_rows?}]}")
    ap.add_argument("--command", required=True, help="Read-only command template, e.g. python examples/mock_query.py --tenant {tenant}")
    ap.add_argument("--runs", type=int, default=5)
    ap.add_argument("--timeout", type=int, default=30)
    ap.add_argument("--output", default="benchmark-result.json")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    if args.runs < 1 or args.runs > 50:
        raise SystemExit("--runs must be between 1 and 50")
    payload = load_json(args.cases)
    cases = payload.get("cases") or []
    if not payload.get("query_id") or len(cases) < 2:
        raise SystemExit("cases file requires query_id and at least two cases")
    variants = []
    for case in cases:
        name, params = case.get("name"), case.get("params")
        if not name or not isinstance(params, dict):
            raise SystemExit("each case requires name and params object")
        command = render(args.command, params)
        if args.dry_run:
            variants.append({"name": name, "command": command})
            continue
        samples = []
        last_stdout = ""
        for _ in range(args.runs):
            rc, elapsed, out, err = run_once(command, args.timeout)
            if rc != 0:
                print(err, file=sys.stderr)
                raise SystemExit(f"case {name} failed with exit code {rc}")
            samples.append(elapsed)
            last_stdout = out.strip()
        rows = case.get("expected_rows", 0)
        plan_hash = None
        notes = []
        if last_stdout:
            try:
                parsed = json.loads(last_stdout)
                rows = int(parsed.get("rows", rows))
                plan_hash = parsed.get("plan_hash")
                if parsed.get("note"):
                    notes.append(str(parsed["note"]))
            except Exception:
                notes.append("stdout was not JSON; timing still captured")
        variants.append({
            "name": name,
            "elapsed_ms": round(statistics.median(samples), 3),
            "rows": rows,
            "plan_hash": plan_hash,
            "notes": notes,
        })
    result = {"query_id": payload["query_id"], "status": "pass", "variants": variants, "evidence": [], "recommended_action": None}
    if args.dry_run:
        print(json.dumps(result, indent=2))
        return 0
    times = [v["elapsed_ms"] for v in variants]
    fastest, slowest = min(times), max(times)
    ratio = slowest / fastest if fastest > 0 else float("inf")
    result["evidence"].append(f"slowest/fastest median latency ratio={ratio:.2f}")
    if ratio >= 2.0:
        result["status"] = "warn"
        result["recommended_action"] = "Inspect plan reuse and cardinality estimates across parameter classes."
    Path(args.output).write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

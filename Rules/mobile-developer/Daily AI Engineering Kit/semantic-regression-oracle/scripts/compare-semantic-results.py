#!/usr/bin/env python3
import argparse, json, math, sys
from pathlib import Path

def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def get_path(obj, path):
    if path in ("", "/"):
        return obj
    cur = obj
    for part in [p for p in path.strip("/").split("/") if p]:
        if isinstance(cur, list):
            cur = cur[int(part)]
        elif isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            raise KeyError(path)
    return cur

def canonical(v):
    return json.dumps(v, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

def compare(mode, a, b, tol):
    if mode in ("exact", "invariant"):
        return a == b
    if mode == "numeric":
        return isinstance(a, (int, float)) and isinstance(b, (int, float)) and math.isclose(float(a), float(b), abs_tol=tol, rel_tol=0.0)
    if mode == "unordered":
        return isinstance(a, list) and isinstance(b, list) and sorted(canonical(x) for x in a) == sorted(canonical(x) for x in b)
    return False

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--suite", required=True)
    ap.add_argument("--baseline", required=True)
    ap.add_argument("--candidate", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    try:
        suite, base, cand = load(args.suite), load(args.baseline), load(args.candidate)
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr); return 2
    key = f"{suite.get('suite_id')}@{suite.get('version')}"
    if base.get("suite") != key or cand.get("suite") != key:
        print("ERROR: suite identity mismatch", file=sys.stderr); return 2
    br, cr = base.get("results", {}), cand.get("results", {})
    report = {"suite": key, "status": "no-change", "scenarios": []}
    blocking = False
    for s in suite.get("scenarios", []):
        sid, tol = s["id"], s.get("numeric_tolerance", 0)
        row = {"id": sid, "critical": s["critical"], "category": s["category"], "status": "no-change", "differences": []}
        if sid not in br or sid not in cr:
            row["status"] = "blocked"
            row["differences"].append({"path": "/", "reason": "missing-result"})
            blocking = True
        else:
            for a in s["assertions"]:
                p, mode = a["path"], a["mode"]
                try:
                    av, bv = get_path(br[sid], p), get_path(cr[sid], p)
                except Exception:
                    row["status"] = "blocked"; row["differences"].append({"path": p, "reason": "missing-path"}); blocking = True; continue
                if not compare(mode, av, bv, tol):
                    row["status"] = "changed"
                    row["differences"].append({"path": p, "mode": mode, "baseline": av, "candidate": bv})
                    if mode == "invariant" or s["critical"]:
                        blocking = True
        report["scenarios"].append(row)
    if any(x["status"] == "changed" for x in report["scenarios"]):
        report["status"] = "changed"
    if blocking:
        report["status"] = "review-required"
    Path(args.out).write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(report["status"])
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
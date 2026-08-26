#!/usr/bin/env python3
import argparse, hashlib, json
from pathlib import Path

READ_LIMIT = 3
MUTATE_LIMIT = 1


def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def fingerprint(value):
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()[:16]


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def load_jsonl(path):
    rows = []
    try:
        for number, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip():
                continue
            row = json.loads(line)
            if not isinstance(row, dict):
                raise ValueError(f"line {number} is not an object")
            rows.append(row)
        return rows
    except Exception as exc:
        if isinstance(exc, ValueError):
            raise
        raise ValueError(f"cannot read {path}: {exc}") from exc


def call_fp(event):
    return fingerprint({"tool": event.get("tool"), "args": event.get("args", {})})


def outcome_fp(event):
    return fingerprint({"status": event.get("status"), "result_summary": event.get("result_summary")})


def since_last_progress(events):
    window = []
    for event in reversed(events):
        if bool(event.get("progress", False)):
            break
        window.append(event)
    return list(reversed(window))


def evaluate(history, candidate):
    tool = candidate.get("tool")
    args = candidate.get("args")
    kind = candidate.get("kind")
    if not isinstance(tool, str) or not isinstance(args, dict) or kind not in {"read", "mutate"}:
        raise ValueError("candidate requires string tool, object args, and kind read|mutate")

    relevant = [e for e in history if isinstance(e, dict) and e.get("tool")]
    window = since_last_progress(relevant)
    cfp = call_fp(candidate)
    exact_no_progress = [e for e in window if call_fp(e) == cfp]

    recent_outcomes = [outcome_fp(e) for e in window if e.get("result_summary") is not None][-READ_LIMIT:]
    same_outcome_streak = 0
    if recent_outcomes:
        last = recent_outcomes[-1]
        for fp in reversed(recent_outcomes):
            if fp != last:
                break
            same_outcome_streak += 1

    limit = MUTATE_LIMIT if kind == "mutate" else READ_LIMIT
    reasons = []
    if len(exact_no_progress) >= limit:
        reasons.append("exact_call_no_progress_limit")
    if same_outcome_streak >= READ_LIMIT:
        reasons.append("same_outcome_no_progress_limit")

    if kind == "mutate" and reasons:
        return {"decision": "block", "call_fingerprint": cfp, "reasons": reasons}
    if reasons:
        return {"decision": "recover", "call_fingerprint": cfp, "reasons": reasons}
    return {"decision": "allow", "call_fingerprint": cfp, "reasons": []}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--history", required=True)
    parser.add_argument("--candidate", required=True)
    args = parser.parse_args()
    try:
        result = evaluate(load_jsonl(args.history), load_json(args.candidate))
    except ValueError as exc:
        print(json.dumps({"decision": "error", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return {"allow": 0, "recover": 3, "block": 4}[result["decision"]]


if __name__ == "__main__":
    raise SystemExit(main())

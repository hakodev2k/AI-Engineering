#!/usr/bin/env python3
import argparse, hashlib, json, sys
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
    return fingerprint({
        "status": event.get("status"),
        "result_summary": event.get("result_summary"),
    })


def evaluate(history, candidate):
    tool = candidate.get("tool")
    args = candidate.get("args")
    kind = candidate.get("kind")
    if not isinstance(tool, str) or not isinstance(args, dict) or kind not in {"read", "mutate"}:
        raise ValueError("candidate requires string tool, object args, and kind read|mutate")

    cfp = call_fp(candidate)
    relevant = [e for e in history if isinstance(e, dict) and e.get("tool")]
    exact = [e for e in relevant if call_fp(e) == cfp]
    no_progress_exact = [e for e in exact if not bool(e.get("progress", False))]

    recent_outcomes = []
    for e in reversed(relevant):
        if e.get("result_summary") is None:
            continue
        if e.get("progress", False):
            break
        recent_outcomes.append(outcome_fp(e))
        if len(recent_outcomes) >= READ_LIMIT:
            break
    same_outcome_streak = 0
    if recent_outcomes:
        first = recent_outcomes[0]
        same_outcome_streak = sum(1 for fp in recent_outcomes if fp == first)

    limit = MUTATE_LIMIT if kind == "mutate" else READ_LIMIT
    reasons = []
    if len(no_progress_exact) >= limit:
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

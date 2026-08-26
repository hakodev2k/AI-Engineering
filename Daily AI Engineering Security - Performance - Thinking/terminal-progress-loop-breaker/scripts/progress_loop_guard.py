#!/usr/bin/env python3
"""External progress governor for observable agent tool/result events."""
import argparse
import hashlib
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def normalize(value, volatile):
    if isinstance(value, dict):
        return {k: normalize(v, volatile) for k, v in sorted(value.items()) if k not in volatile}
    if isinstance(value, list):
        return [normalize(v, volatile) for v in value]
    if isinstance(value, str):
        return " ".join(value.split())
    return value


def fingerprint(event, volatile):
    body = {
        "tool": event.get("tool"),
        "arguments": normalize(event.get("arguments", {}), volatile),
        "result_class": event.get("result_class"),
    }
    raw = json.dumps(body, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:20]


def evaluate(state, event, policy):
    required = {"turn", "tokens_used", "wall_seconds", "tool", "arguments", "result_class", "progress_markers"}
    missing = sorted(required - event.keys())
    if missing:
        return state, {"ok": False, "decision": "terminal_stuck", "reasons": ["missing:" + x for x in missing]}

    volatile = set(policy.get("volatile_argument_keys", []))
    fp = fingerprint(event, volatile)
    history = list(state.get("history", []))
    previous_markers = set(state.get("progress_markers", []))
    current_markers = set(str(x) for x in event.get("progress_markers", []))
    new_progress = sorted(current_markers - previous_markers)

    same_failures = 0
    if event.get("result_class") != "success":
        for item in reversed(history):
            if item.get("fingerprint") != fp or item.get("result_class") == "success":
                break
            same_failures += 1
        same_failures += 1

    history.append({"fingerprint": fp, "result_class": event.get("result_class"), "turn": event["turn"]})
    history = history[-100:]
    new_state = {"history": history, "progress_markers": sorted(previous_markers | current_markers)}

    reasons = []
    hard = False
    if event["turn"] >= int(policy.get("max_turns", 40)):
        reasons.append("turn_budget_exhausted"); hard = True
    if event["tokens_used"] >= int(policy.get("max_tokens", 500000)):
        reasons.append("token_budget_exhausted"); hard = True
    if event["wall_seconds"] >= int(policy.get("max_wall_seconds", 1800)):
        reasons.append("wall_budget_exhausted"); hard = True

    terminal_n = int(policy.get("terminal_equivalent_failures", 4))
    warn_n = int(policy.get("warn_equivalent_failures", 2))
    if same_failures >= terminal_n and not new_progress:
        reasons.append("equivalent_failure_terminal_threshold"); hard = True
    elif same_failures >= warn_n and not new_progress:
        reasons.append("equivalent_failure_warning_threshold")

    if hard:
        decision = "checkpoint_and_stop" if policy.get("checkpoint_before_terminal", True) else "terminal_stuck"
    else:
        decision = "continue"

    return new_state, {
        "ok": True,
        "decision": decision,
        "fingerprint": fp,
        "equivalent_failure_count": same_failures,
        "new_progress_markers": new_progress,
        "reasons": reasons,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--state", required=True)
    parser.add_argument("--event", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        state = load_json(args.state) if Path(args.state).exists() else {}
        new_state, result = evaluate(state, load_json(args.event), load_json(args.policy))
        Path(args.state).write_text(json.dumps(new_state, indent=2, sort_keys=True), encoding="utf-8")
    except ValueError as exc:
        print(json.dumps({"ok": False, "decision": "terminal_stuck", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 4 if result["decision"] in {"checkpoint_and_stop", "terminal_stuck"} else 0


if __name__ == "__main__":
    raise SystemExit(main())

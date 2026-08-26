#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def load_jsonl(path):
    rows = []
    for line_no, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except Exception as exc:
            raise ValueError(f"invalid JSONL line {line_no}: {exc}") from exc
    return rows


def step_signature(step):
    calls = step.get("tool_calls", [])
    normalized = sorted(
        [{"tool": c.get("tool"), "args": c.get("args", {})} for c in calls],
        key=canonical,
    )
    return digest(normalized) if normalized else None


def progress_signature(step, fields):
    material = {f: step.get(f) for f in fields if step.get(f) is not None}
    if step.get("tool_result") is not None:
        material["tool_result"] = step["tool_result"]
    return digest(material) if material else None


def evaluate(steps, policy):
    max_steps = int(policy.get("max_total_steps", 80))
    max_streak = int(policy.get("max_no_progress_streak", 3))
    fields = policy.get("progress_fields", [])
    if max_streak < 2 or max_steps < 1:
        raise ValueError("invalid policy bounds")
    if not steps:
        return {"decision": "continue", "reason": "no_steps", "no_progress_streak": 0}

    if len(steps) >= max_steps:
        return {"decision": "stop", "reason": "hard_step_limit", "no_progress_streak": 0,
                "checkpoint_required": bool(policy.get("require_durable_checkpoint_before_stop", True))}

    streak = 1
    last_action = step_signature(steps[-1])
    last_progress = progress_signature(steps[-1], fields)
    for i in range(len(steps) - 2, -1, -1):
        current_action = step_signature(steps[i])
        current_progress = progress_signature(steps[i], fields)
        same_action = last_action is not None and current_action == last_action
        same_progress = current_progress == last_progress
        if same_action and same_progress:
            streak += 1
            if streak >= max_streak:
                return {"decision": "stop", "reason": "repeated_action_without_new_evidence",
                        "no_progress_streak": streak,
                        "checkpoint_required": bool(policy.get("require_durable_checkpoint_before_stop", True))}
        else:
            break

    if len(steps) >= 2:
        prev_progress = progress_signature(steps[-2], fields)
        if last_progress is not None and last_progress != prev_progress:
            return {"decision": "continue", "reason": "new_progress_evidence", "no_progress_streak": 0}

    return {"decision": "continue", "reason": "below_threshold", "no_progress_streak": streak}


def main():
    ap = argparse.ArgumentParser(description="Detect tool-agent no-progress loops from JSONL traces.")
    ap.add_argument("--trace", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    try:
        result = evaluate(load_jsonl(args.trace), load_json(args.policy))
        print(json.dumps(result, indent=2, sort_keys=True))
        return 3 if result["decision"] == "stop" else 0
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

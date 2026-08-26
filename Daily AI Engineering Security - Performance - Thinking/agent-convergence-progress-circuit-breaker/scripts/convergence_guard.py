#!/usr/bin/env python3
"""Evaluate observable progress and block non-convergent agent continuation."""
import argparse
import json
import sys
from pathlib import Path


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def read_jsonl(path):
    rows = []
    try:
        lines = Path(path).read_text(encoding="utf-8").splitlines()
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    for number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except Exception as exc:
            raise ValueError(f"line {number}: invalid JSON: {exc}") from exc
    return rows


def analyze(rows, policy):
    required = {"acceptance_open", "artifact_fingerprint", "evidence_count", "new_work_items", "finalizing"}
    max_no_progress = int(policy.get("max_no_progress_turns", 3))
    max_expansion = int(policy.get("max_work_expansion_without_acceptance_change", 2))
    require_delta = bool(policy.get("require_artifact_or_evidence_delta", True))
    require_row = bool(policy.get("require_acceptance_row_for_new_work", True))
    block_final = bool(policy.get("block_finalization_with_open_required_rows", True))

    previous = None
    no_progress_streak = 0
    max_no_progress_streak = 0
    expansion_without_closure = 0
    violations = []

    for index, row in enumerate(rows):
        missing = required - row.keys()
        if missing:
            raise ValueError(f"row {index}: missing {','.join(sorted(missing))}")
        open_rows = int(row["acceptance_open"])
        evidence_count = int(row["evidence_count"])
        new_work = int(row["new_work_items"])
        if open_rows < 0 or evidence_count < 0 or new_work < 0:
            raise ValueError(f"row {index}: counts must be non-negative")

        if block_final and bool(row["finalizing"]) and open_rows > 0:
            violations.append({"row": index, "reason": "finalization_with_open_acceptance_rows"})

        if require_row and new_work > 0 and not row.get("new_work_acceptance_row"):
            violations.append({"row": index, "reason": "new_work_without_acceptance_row"})

        if previous is not None:
            acceptance_reduced = open_rows < previous["acceptance_open"]
            artifact_changed = row["artifact_fingerprint"] != previous["artifact_fingerprint"]
            evidence_increased = evidence_count > previous["evidence_count"]
            observable_progress = acceptance_reduced or artifact_changed or evidence_increased

            if require_delta and not observable_progress:
                no_progress_streak += 1
            else:
                no_progress_streak = 0
            max_no_progress_streak = max(max_no_progress_streak, no_progress_streak)

            if new_work > 0 and not acceptance_reduced:
                expansion_without_closure += new_work
            elif acceptance_reduced:
                expansion_without_closure = 0

        previous = {
            "acceptance_open": open_rows,
            "artifact_fingerprint": row["artifact_fingerprint"],
            "evidence_count": evidence_count,
        }

    if max_no_progress_streak > max_no_progress:
        violations.append({"reason": "no_progress_turn_budget_exceeded", "streak": max_no_progress_streak})
    if expansion_without_closure > max_expansion:
        violations.append({"reason": "work_expansion_budget_exceeded", "count": expansion_without_closure})

    return {
        "decision": "block" if violations else "pass",
        "violations": violations,
        "turns": len(rows),
        "max_no_progress_streak": max_no_progress_streak,
        "expansion_without_closure": expansion_without_closure,
        "acceptance_open_final": rows[-1]["acceptance_open"] if rows else None,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ledger", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        result = analyze(read_jsonl(args.ledger), read_json(args.policy))
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["decision"] == "pass" else 3


if __name__ == "__main__":
    raise SystemExit(main())

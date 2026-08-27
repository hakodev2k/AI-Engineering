#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load_jsonl(path):
    rows = []
    for line_number, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except Exception as exc:
            raise ValueError(f"line {line_number}: {exc}") from exc
    return rows


def analyze(rows, max_unverified_steps=5):
    required = {"step", "action", "evidence_ids", "assumption_ids", "verification_status", "progress_claim"}
    unsupported_completion_steps = []
    unresolved_assumptions = set()
    since_verified = 0
    first_risk_step = None

    for row in rows:
        missing = required - set(row)
        if missing:
            raise ValueError("missing:" + ",".join(sorted(missing)))

        if row["verification_status"] == "verified":
            since_verified = 0
        else:
            since_verified += 1

        for assumption_id in row["assumption_ids"]:
            unresolved_assumptions.add(assumption_id)
        for assumption_id in row.get("resolved_assumption_ids", []):
            unresolved_assumptions.discard(assumption_id)

        if row["progress_claim"] in ("done", "fixed", "complete") and not row["evidence_ids"]:
            unsupported_completion_steps.append(row["step"])
            if first_risk_step is None:
                first_risk_step = row["step"]

        if since_verified > max_unverified_steps and first_risk_step is None:
            first_risk_step = row["step"]

    return {
        "status": "measured",
        "steps": len(rows),
        "unsupported_completion_steps": unsupported_completion_steps,
        "unresolved_assumptions": sorted(unresolved_assumptions),
        "first_risk_step": first_risk_step,
        "requires_independent_verification": bool(
            unsupported_completion_steps or unresolved_assumptions or first_risk_step is not None
        )
    }


def main():
    parser = argparse.ArgumentParser(description="Find observable long-horizon trajectory risks before completion.")
    parser.add_argument("trace", help="JSONL trajectory file")
    parser.add_argument("--max-unverified-steps", type=int, default=5)
    args = parser.parse_args()

    if args.max_unverified_steps < 1:
        print("--max-unverified-steps must be >= 1", file=sys.stderr)
        return 2

    try:
        result = analyze(load_jsonl(args.trace), args.max_unverified_steps)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2

    print(json.dumps(result, indent=2, sort_keys=True))
    return 3 if result["requires_independent_verification"] else 0


if __name__ == "__main__":
    raise SystemExit(main())

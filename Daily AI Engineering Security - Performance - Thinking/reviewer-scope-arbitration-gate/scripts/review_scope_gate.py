#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

REQUIRED_FINDING = {
    "id",
    "severity",
    "criterion_id",
    "diff_related",
    "reproducible_under_assumptions",
    "blocks_acceptance",
}


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot_read:{path}:{exc}"}))
        raise SystemExit(2)


def arbitrate(contract, finding):
    missing = sorted(REQUIRED_FINDING - finding.keys())
    if missing:
        return {"ok": False, "decision": "invalid", "reasons": [f"missing:{x}" for x in missing]}

    criteria = {c["id"]: c for c in contract.get("criteria", []) if isinstance(c, dict) and "id" in c}
    criterion_id = finding["criterion_id"]
    reasons = []

    if criterion_id not in criteria:
        reasons.append("criterion_not_approved")
    if not bool(finding["diff_related"]):
        reasons.append("not_caused_by_or_present_in_reviewed_diff")
    if not bool(finding["reproducible_under_assumptions"]):
        reasons.append("not_reproducible_under_declared_assumptions")
    if not bool(finding["blocks_acceptance"]):
        reasons.append("does_not_block_original_acceptance")

    if reasons:
        return {
            "ok": True,
            "decision": "defer",
            "finding_id": finding["id"],
            "reasons": reasons,
            "requires_scope_owner_approval": True,
        }

    return {
        "ok": True,
        "decision": "accept_blocker",
        "finding_id": finding["id"],
        "criterion_id": criterion_id,
        "requires_scope_owner_approval": False,
    }


def main():
    parser = argparse.ArgumentParser(description="Arbitrate whether an AI reviewer finding may block a bounded task.")
    parser.add_argument("--contract", required=True)
    parser.add_argument("--finding", required=True)
    args = parser.parse_args()
    result = arbitrate(load_json(args.contract), load_json(args.finding))
    print(json.dumps(result, indent=2, sort_keys=True))
    if not result["ok"]:
        return 2
    return 0 if result["decision"] == "accept_blocker" else 3


if __name__ == "__main__":
    raise SystemExit(main())

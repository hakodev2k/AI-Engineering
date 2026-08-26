#!/usr/bin/env python3
"""Classify reviewer findings and stop non-progress loops deterministically."""
import argparse
import json
import sys
from pathlib import Path


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"invalid input: {exc}"}), file=sys.stderr)
        raise SystemExit(2)


def classify_finding(finding, approved_requirements):
    required = ["id", "requirement_id", "diff_caused", "reproducible", "evidence"]
    missing = [k for k in required if k not in finding]
    if missing:
        return {"id": finding.get("id", "unknown"), "decision": "defer", "reasons": [f"missing:{k}" for k in missing]}
    reasons = []
    if finding["requirement_id"] not in approved_requirements:
        reasons.append("not_mapped_to_approved_requirement")
    if finding["diff_caused"] is not True:
        reasons.append("not_caused_by_reviewed_diff")
    if finding["reproducible"] is not True:
        reasons.append("not_reproducible_under_assumptions")
    if not isinstance(finding["evidence"], str) or not finding["evidence"].strip():
        reasons.append("missing_evidence")
    return {"id": finding["id"], "decision": "defer" if reasons else "block", "reasons": reasons}


def evaluate(state):
    approved = state.get("approved_requirements")
    findings = state.get("findings")
    cycle = state.get("review_cycle")
    max_cycles = state.get("max_review_cycles", 2)
    progress = state.get("production_progress_units")
    previous = state.get("previous_progress_units")
    if not isinstance(approved, list) or not isinstance(findings, list):
        return {"ok": False, "decision": "stop", "reasons": ["invalid_scope_state"]}
    if not isinstance(cycle, int) or not isinstance(max_cycles, int) or cycle < 0 or max_cycles < 1:
        return {"ok": False, "decision": "stop", "reasons": ["invalid_cycle_budget"]}
    if not isinstance(progress, int) or not isinstance(previous, int) or progress < 0 or previous < 0:
        return {"ok": False, "decision": "stop", "reasons": ["invalid_progress_counter"]}
    classified = [classify_finding(f, set(approved)) for f in findings]
    blockers = [x for x in classified if x["decision"] == "block"]
    deferred = [x for x in classified if x["decision"] == "defer"]
    if cycle >= max_cycles:
        return {"ok": False, "decision": "escalate", "reason": "review_cycle_budget_exhausted", "blockers": blockers, "deferred": deferred}
    if progress <= previous and not blockers:
        return {"ok": False, "decision": "stop", "reason": "no_measurable_production_progress", "blockers": [], "deferred": deferred}
    return {"ok": True, "decision": "rework" if blockers else "complete_candidate", "blockers": blockers, "deferred": deferred}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("state")
    args = parser.parse_args()
    result = evaluate(load(args.state))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())

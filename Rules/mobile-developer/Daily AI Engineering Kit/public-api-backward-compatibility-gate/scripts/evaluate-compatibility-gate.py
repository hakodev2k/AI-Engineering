#!/usr/bin/env python3
import argparse
import json
import pathlib
import sys


def load(path):
    return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--diff", required=True)
    ap.add_argument("--review", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    try:
        diff = load(args.diff)
        review = load(args.review)
        policy = load(args.policy)
    except Exception as e:
        print(f"ERROR loading JSON: {e}", file=sys.stderr)
        return 2

    errors = []
    changes = diff.get("changes")
    reviewed = review.get("changes")
    if not isinstance(changes, list) or not isinstance(reviewed, list):
        print("ERROR diff/review changes must be arrays", file=sys.stderr)
        return 2

    by_id = {c.get("change_id"): c for c in reviewed if isinstance(c, dict)}
    breaking_kinds = set(policy.get("breaking_change_kinds", []))
    unknown_fail_closed = bool(policy.get("fail_closed_on_unknown_change_kind", True))
    human_required = bool(policy.get("human_approval_required_for_breaking", True))
    dep_required = bool(policy.get("deprecation_evidence_required", True))

    for c in changes:
        cid = c.get("change_id")
        r = by_id.get(cid)
        if not r:
            errors.append(f"{cid}: missing review record")
            continue
        kind = c.get("kind")
        classification = r.get("classification")
        is_breaking = bool(c.get("breaking_candidate")) or kind in breaking_kinds
        if unknown_fail_closed and not kind:
            errors.append(f"{cid}: unknown change kind")
        if is_breaking:
            if classification not in {"breaking", "approved-breaking"}:
                errors.append(f"{cid}: breaking candidate classified as {classification}")
            if classification == "approved-breaking":
                if human_required and not review.get("approval_id"):
                    errors.append(f"{cid}: approved-breaking without approval_id")
                if dep_required and not r.get("deprecation_evidence"):
                    errors.append(f"{cid}: approved-breaking without deprecation evidence")
            else:
                errors.append(f"{cid}: unapproved breaking change")
        elif classification not in {"compatible", "needs-review"}:
            errors.append(f"{cid}: unexpected classification {classification}")
        if classification == "needs-review":
            errors.append(f"{cid}: unresolved review")
        if not r.get("evidence"):
            errors.append(f"{cid}: missing evidence")
        if not r.get("consumer_risk"):
            errors.append(f"{cid}: missing consumer_risk")

    reviewed_ids = {c.get("change_id") for c in reviewed if isinstance(c, dict)}
    diff_ids = {c.get("change_id") for c in changes if isinstance(c, dict)}
    extras = reviewed_ids - diff_ids
    if extras:
        errors.append(f"review contains unknown change ids: {sorted(extras)}")

    decision = review.get("decision")
    if errors:
        for e in errors:
            print(f"BLOCK {e}", file=sys.stderr)
        print("GATE=blocked", file=sys.stderr)
        return 1
    if decision not in {"reviewed-compatible", "reviewed-breaking-approved"}:
        print(f"BLOCK invalid final review decision: {decision}", file=sys.stderr)
        return 1
    print("GATE=verified-compatible")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

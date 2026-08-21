#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def file_sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def result(status, reasons):
    print(json.dumps({"status": status, "reasons": reasons}, indent=2))
    return 0 if status == "verified" else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["snapshot", "gate"], default="gate")
    ap.add_argument("--record", required=True)
    ap.add_argument("--compatibility")
    ap.add_argument("--review")
    ap.add_argument("--policy", required=True)
    a = ap.parse_args()
    try:
        record, policy = load(a.record), load(a.policy)
    except Exception as e:
        print(json.dumps({"status":"blocked","reasons":[str(e)]})); return 2

    reasons=[]
    for side in ("baseline","candidate"):
        binding=record.get(side,{})
        p=binding.get("schema_path")
        expected=binding.get("schema_sha256")
        if not p or not expected or not Path(p).exists():
            reasons.append(f"{side} schema binding missing or file unavailable")
        elif file_sha(p) != expected:
            reasons.append(f"{side} schema hash mismatch")

    if a.mode == "snapshot":
        return result("verified" if not reasons else "blocked", reasons)

    if not a.compatibility or not a.review:
        reasons.append("compatibility and review records are required")
        return result("blocked", reasons)

    try:
        compat, review = load(a.compatibility), load(a.review)
    except Exception as e:
        reasons.append(str(e)); return result("blocked", reasons)

    candidate = record.get("candidate", {})
    csha = candidate.get("schema_sha256")
    if compat.get("candidate_schema_sha256") != csha:
        reasons.append("compatibility report does not bind to candidate schema hash")
    if compat.get("baseline_schema_sha256") != record.get("baseline",{}).get("schema_sha256"):
        reasons.append("compatibility report does not bind to baseline schema hash")

    mandatory={c["name"] for c in record.get("consumers",[]) if c.get("mandatory_replay")}
    passed={r.get("consumer") for r in record.get("replay_checks",[]) if r.get("status")=="pass" and r.get("candidate_schema_sha256")==csha}
    missing=sorted(mandatory-passed)
    if record.get("risk") in policy.get("mandatory_replay_for_risk",[]):
        mandatory={c["name"] for c in record.get("consumers",[])}
        missing=sorted(mandatory-passed)
    if missing:
        reasons.append("missing successful consumer replay: "+", ".join(missing))

    status=compat.get("status")
    reviewer=review.get("reviewer")
    author=record.get("candidate_author")
    if status in policy.get("independent_review_for",[]) and (not reviewer or reviewer==author or not review.get("independent",False)):
        reasons.append("independent review required")
    if review.get("candidate_schema_sha256") != csha:
        reasons.append("review is not bound to candidate schema hash")
    if review.get("status") == "blocked":
        reasons.append("review explicitly blocked candidate")

    if reasons:
        return result("blocked", reasons)

    if status == "breaking":
        approval=record.get("approval") or {}
        valid = approval.get("approved") is True and approval.get("candidate_revision")==candidate.get("revision") and approval.get("candidate_schema_sha256")==csha
        if not valid:
            return result("human-approval-required", ["breaking contract requires approval bound to candidate revision and schema hash"])
    if status == "migration-required" and policy.get("migration_required_changes_block_release", True):
        if review.get("migration_ready") is not True:
            return result("migration-required", ["consumer migration evidence is incomplete"])
    return result("verified", [])

if __name__ == "__main__": sys.exit(main())

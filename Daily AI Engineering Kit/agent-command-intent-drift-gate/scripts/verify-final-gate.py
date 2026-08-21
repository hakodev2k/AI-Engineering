#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys


def canonical(v):
    return json.dumps(v, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(v):
    return hashlib.sha256(canonical(v).encode("utf-8")).hexdigest()


def normalize_intent(intent, policy):
    data = dict(intent)
    exe = data["executable"].strip()
    if not policy.get("normalization", {}).get("case_sensitive_executable", False):
        exe = exe.lower()
    data["executable"] = exe
    data["arguments"] = [" ".join(x.split()) if policy.get("normalization", {}).get("collapse_whitespace", True) else x for x in data.get("arguments", [])]
    data["target"] = data["target"].strip()
    data["environment"] = data["environment"].strip().lower()
    return data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--intent", required=True)
    ap.add_argument("--execution", required=True)
    ap.add_argument("--decision", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--review")
    ap.add_argument("--actor", required=True)
    ns = ap.parse_args()
    try:
        intent = json.load(open(ns.intent, encoding="utf-8"))
        execution = json.load(open(ns.execution, encoding="utf-8"))
        decision = json.load(open(ns.decision, encoding="utf-8"))
        policy = json.load(open(ns.policy, encoding="utf-8"))
        if decision.get("intent_id") != intent.get("intent_id"):
            print(json.dumps({"status":"blocked","reason":"intent-id-mismatch"})); return 2
        if decision.get("intent_fingerprint") != digest(normalize_intent(intent, policy)):
            print(json.dumps({"status":"blocked","reason":"intent-fingerprint-mismatch"})); return 2
        if decision.get("policy_fingerprint") != digest(policy):
            print(json.dumps({"status":"blocked","reason":"policy-fingerprint-mismatch"})); return 2
        if decision.get("execution_fingerprint") != digest(execution):
            print(json.dumps({"status":"blocked","reason":"execution-fingerprint-mismatch"})); return 2
        if decision.get("status") == "blocked":
            print(json.dumps({"status":"blocked","reason":"deterministic-drift-blocker"})); return 2
        approval_action = intent.get("approval_action")
        dangerous = approval_action in policy.get("approval_required_actions", [])
        need_review = decision.get("status") == "review-required" or intent.get("risk") in policy.get("review", {}).get("require_independent_review_for_risk", []) or dangerous
        review = None
        if need_review:
            if not ns.review:
                print(json.dumps({"status":"blocked","reason":"review-required"})); return 2
            review = json.load(open(ns.review, encoding="utf-8"))
            if review.get("intent_fingerprint") != decision.get("intent_fingerprint"):
                print(json.dumps({"status":"blocked","reason":"review-intent-fingerprint-mismatch"})); return 2
            if review.get("status") != "approved":
                print(json.dumps({"status":"blocked","reason":"review-not-approved"})); return 2
            if policy.get("review", {}).get("allow_self_review") is False and review.get("reviewer_id") == ns.actor and intent.get("risk") in ("high","critical"):
                print(json.dumps({"status":"blocked","reason":"self-review-forbidden"})); return 2
        if dangerous:
            if review is None or review.get("reviewer_type") != "human":
                print(json.dumps({"status":"blocked","reason":"human-approval-required"})); return 2
            if review.get("approval_action") != approval_action:
                print(json.dumps({"status":"blocked","reason":"approval-action-mismatch"})); return 2
        print(json.dumps({"status":"verified","intent_id":intent["intent_id"],"execution_fingerprint":decision["execution_fingerprint"]}))
        return 0
    except Exception as exc:
        print(json.dumps({"status":"error","error":str(exc)})); return 1


if __name__ == "__main__":
    sys.exit(main())

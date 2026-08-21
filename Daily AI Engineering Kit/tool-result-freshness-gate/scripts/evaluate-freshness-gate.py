#!/usr/bin/env python3
import argparse, json, sys


def load(path):
    with open(path, encoding="utf-8") as f: return json.load(f)

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--evaluations", required=True, help="JSON array of freshness evaluator outputs")
    p.add_argument("--review", required=True)
    p.add_argument("--policy", required=True)
    a=p.parse_args()
    try:
        evaluations=load(a.evaluations)
        review=load(a.review)
        policy=load(a.policy)
    except Exception as ex:
        print(json.dumps({"status":"blocked","reasons":[f"invalid input: {ex}"]})); return 2
    reasons=[]
    if not isinstance(evaluations,list) or not evaluations:
        reasons.append("no-freshness-evaluations")
    else:
        for ev in evaluations:
            if ev.get("status") != "fresh": reasons.append(f"result-not-fresh:{ev.get('result_id','unknown')}")
    reviewed=set(review.get("reviewed_result_ids",[]))
    required={ev.get("result_id") for ev in evaluations if ev.get("result_id")}
    if not required.issubset(reviewed): reasons.append("review-missing-results")
    if review.get("status") != "approved": reasons.append("review-not-approved")
    if review.get("decision_risk") == "high" and policy.get("require_independent_review_for_high_risk",True):
        if review.get("reviewer_id") == review.get("curator_id"):
            reasons.append("high-risk-review-not-independent")
    if review.get("human_approval_required") and not review.get("human_approval_present"):
        reasons.append("human-approval-missing")
    status="verified" if not reasons else "blocked"
    print(json.dumps({"status":status,"reasons":sorted(set(reasons))}))
    return 0 if status=="verified" else 4

if __name__=="__main__": sys.exit(main())

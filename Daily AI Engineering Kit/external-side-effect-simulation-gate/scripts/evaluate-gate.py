#!/usr/bin/env python3
import argparse, json, sys

def load(path, optional=False):
    if not path:
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def required_approval(plan, policy):
    return plan["effect_category"] in policy["approval_required_categories"] or any(t in policy["approval_required_risk_tags"] for t in plan.get("risk_tags",[])) or (policy.get("simulation_unavailable_requires_approval") and plan.get("simulation_mode")=="simulation-unavailable")

def independent_required(plan, policy):
    return plan["effect_category"] in policy["independent_review_required_categories"] or any(t in policy["independent_review_required_risk_tags"] for t in plan.get("risk_tags",[]))

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--stage", choices=["simulation","live"], required=True)
    ap.add_argument("--plan", required=True); ap.add_argument("--policy", required=True)
    ap.add_argument("--simulation"); ap.add_argument("--review"); ap.add_argument("--approval")
    a=ap.parse_args(); plan=load(a.plan); policy=load(a.policy); reasons=[]
    if plan.get("status")!="planned": reasons.append("plan-not-executable")
    if not plan.get("target") or not plan.get("environment"): reasons.append("unknown-target-or-environment")
    if a.stage=="simulation":
        if plan.get("simulation_mode")=="simulation-unavailable": reasons.append("simulation-unavailable")
        decision="allow-simulation" if not reasons else "block"
    else:
        sim=load(a.simulation); review=load(a.review); approval=load(a.approval)
        if not sim: reasons.append("missing-simulation-record")
        else:
            if sim.get("action_id")!=plan.get("action_id") or sim.get("plan_revision")!=plan.get("plan_revision"): reasons.append("stale-or-mismatched-simulation")
            if sim.get("request_fingerprint")!=plan.get("request_fingerprint"): reasons.append("request-fingerprint-drift")
            if sim.get("status")!="passed": reasons.append("simulation-not-passed")
            if sim.get("unexpected_effects"): reasons.append("unexpected-simulation-effects")
        if not review: reasons.append("missing-review")
        else:
            if review.get("action_id")!=plan.get("action_id") or review.get("plan_revision")!=plan.get("plan_revision"): reasons.append("stale-or-mismatched-review")
            if review.get("status") not in ["verified-for-approval","human-approval-required"]: reasons.append("review-not-verified")
            if independent_required(plan,policy) and review.get("reviewer_id")==plan.get("executor_id"): reasons.append("reviewer-not-independent")
        if required_approval(plan,policy):
            if not approval: reasons.append("missing-human-approval")
            else:
                if approval.get("action_id")!=plan.get("action_id") or approval.get("plan_revision")!=plan.get("plan_revision"): reasons.append("stale-or-mismatched-approval")
                if approval.get("status")!="approved" or not approval.get("approved_by"): reasons.append("approval-not-approved")
                if approval.get("request_fingerprint")!=plan.get("request_fingerprint"): reasons.append("approval-fingerprint-drift")
        decision="allow-live" if not reasons else "block"
    print(json.dumps({"stage":a.stage,"decision":decision,"reasons":reasons},indent=2))
    return 0 if decision.startswith("allow-") else 3
if __name__=="__main__": sys.exit(main())

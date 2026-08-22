#!/usr/bin/env python3
import argparse, json, sys

REQUIRED=["action_id","plan_revision","provider","operation","target","environment","effect_category","risk_tags","reversible","simulation_mode","request_fingerprint","expected_effects","executor_id","approval_required","status"]
def load(p):
    with open(p,encoding="utf-8") as f:return json.load(f)
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--plan",required=True);ap.add_argument("--policy",required=True);a=ap.parse_args()
    plan=load(a.plan);policy=load(a.policy);errors=[]
    for k in REQUIRED:
        if k not in plan:errors.append(f"missing:{k}")
    if errors:
        print(json.dumps({"status":"invalid","errors":errors},indent=2));return 2
    if plan["effect_category"] not in policy["effect_categories"]:errors.append("invalid-effect-category")
    if plan["simulation_mode"] not in policy["simulation_modes"]:errors.append("invalid-simulation-mode")
    if not isinstance(plan["plan_revision"],int) or plan["plan_revision"]<1:errors.append("invalid-plan-revision")
    if not isinstance(plan["risk_tags"],list):errors.append("risk-tags-not-array")
    if not isinstance(plan["expected_effects"],list) or not plan["expected_effects"]:errors.append("expected-effects-empty")
    fp=plan["request_fingerprint"]
    if not isinstance(fp,str) or len(fp)!=64 or any(c not in "0123456789abcdefABCDEF" for c in fp):errors.append("invalid-request-fingerprint")
    required=plan["effect_category"] in policy["approval_required_categories"] or any(t in policy["approval_required_risk_tags"] for t in plan["risk_tags"])
    if policy.get("simulation_unavailable_requires_approval") and plan["simulation_mode"]=="simulation-unavailable":required=True
    if bool(plan["approval_required"])!=required:errors.append(f"approval-required-mismatch:expected={required}")
    if plan["status"]!="planned":errors.append("plan-not-executable")
    print(json.dumps({"status":"valid" if not errors else "invalid","approval_required":required,"errors":errors},indent=2))
    return 0 if not errors else 2
if __name__=="__main__":sys.exit(main())

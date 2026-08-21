#!/usr/bin/env python3
import argparse, hashlib, json, sys

def canonical(v): return json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False)
def digest(v): return hashlib.sha256(canonical(v).encode("utf-8")).hexdigest()
def main():
 ap=argparse.ArgumentParser(); ap.add_argument("--report",required=True); ap.add_argument("--inventory",required=True); ap.add_argument("--policy",required=True); ap.add_argument("--review"); ap.add_argument("--actor",required=True); ns=ap.parse_args()
 try:
  report=json.load(open(ns.report,encoding="utf-8")); inv=json.load(open(ns.inventory,encoding="utf-8")); pol=json.load(open(ns.policy,encoding="utf-8"))
  if report.get("inventory_fingerprint")!=digest(inv): print(json.dumps({"status":"blocked","reason":"inventory-fingerprint-mismatch"})); return 2
  if report.get("policy_fingerprint")!=digest(pol): print(json.dumps({"status":"blocked","reason":"policy-fingerprint-mismatch"})); return 2
  if report.get("status")=="blocked": print(json.dumps({"status":"blocked","reason":"deterministic-blocker"})); return 2
  risks=[c.get("risk") for c in inv.get("conflicts",[])]
  need=report.get("status")=="review-required" or any(r in pol.get("verification",{}).get("require_independent_review_for_risk",[]) for r in risks)
  if need:
   if not ns.review: print(json.dumps({"status":"blocked","reason":"review-required"})); return 2
   review=json.load(open(ns.review,encoding="utf-8"))
   if review.get("report_fingerprint")!=report.get("report_fingerprint"): print(json.dumps({"status":"blocked","reason":"review-report-fingerprint-mismatch"})); return 2
   if review.get("status")!="approved": print(json.dumps({"status":"blocked","reason":"review-not-approved"})); return 2
   if pol.get("verification",{}).get("allow_self_review") is False and review.get("reviewer_id")==ns.actor:
    print(json.dumps({"status":"blocked","reason":"self-review-forbidden"})); return 2
  print(json.dumps({"status":"verified","repository_revision":report.get("repository_revision"),"report_fingerprint":report.get("report_fingerprint")})); return 0
 except Exception as e: print(json.dumps({"status":"error","error":str(e)})); return 1
if __name__=="__main__": sys.exit(main())

#!/usr/bin/env python3
import argparse,hashlib,json,sys


def canonical(v): return json.dumps(v,sort_keys=True,separators=(',',':'))
def digest(v): return hashlib.sha256(canonical(v).encode()).hexdigest()

def main():
 ap=argparse.ArgumentParser(); ap.add_argument('--report',required=True); ap.add_argument('--session',required=True); ap.add_argument('--policy',required=True); ap.add_argument('--review'); ns=ap.parse_args()
 try:
  report=json.load(open(ns.report,encoding='utf-8')); session=json.load(open(ns.session,encoding='utf-8')); policy=json.load(open(ns.policy,encoding='utf-8'))
  expected_report=digest({k:v for k,v in report.items() if k!='fingerprint'})
  if report.get('fingerprint')!=expected_report: print(json.dumps({'status':'blocked','reason':'report-integrity-mismatch'})); return 2
  if report.get('phase')!='final': print(json.dumps({'status':'blocked','reason':'final-phase-required'})); return 2
  if report.get('session_id')!=session.get('session_id'): print(json.dumps({'status':'blocked','reason':'session-id-mismatch'})); return 2
  if report.get('session_fingerprint')!=digest(session): print(json.dumps({'status':'blocked','reason':'session-fingerprint-mismatch'})); return 2
  if report.get('policy_fingerprint')!=digest(policy): print(json.dumps({'status':'blocked','reason':'policy-fingerprint-mismatch'})); return 2
  if report.get('status')=='blocked': print(json.dumps({'status':'blocked','reason':'deterministic-blocker'})); return 2
  need=report.get('status')=='review-required' or session.get('risk') in ('high','critical')
  if need:
   if not ns.review: print(json.dumps({'status':'blocked','reason':'review-required'})); return 2
   review=json.load(open(ns.review,encoding='utf-8'))
   if review.get('report_fingerprint')!=report.get('fingerprint'): print(json.dumps({'status':'blocked','reason':'review-fingerprint-mismatch'})); return 2
   if review.get('status')!='approved': print(json.dumps({'status':'blocked','reason':'review-not-approved'})); return 2
   if policy.get('review',{}).get('allow_self_review') is False and review.get('reviewer_id')==session.get('actor_id') and session.get('risk') in ('high','critical'):
    print(json.dumps({'status':'blocked','reason':'self-review-forbidden'})); return 2
  print(json.dumps({'status':'verified','session_id':session['session_id'],'head_revision':report.get('head_revision')})); return 0
 except Exception as e: print(json.dumps({'status':'error','error':str(e)})); return 1
if __name__=='__main__': sys.exit(main())

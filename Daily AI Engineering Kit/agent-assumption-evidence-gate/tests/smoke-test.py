#!/usr/bin/env python3
import hashlib, json, subprocess, sys, tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
POLICY=ROOT/'config'/'assumption-policy.json'
EVAL=ROOT/'scripts'/'evaluate-assumptions.py'
FINAL=ROOT/'scripts'/'evaluate-final-gate.py'

def run(args, expect):
    p=subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
    if p.returncode!=expect:
        raise AssertionError(f"expected {expect}, got {p.returncode}\nstdout={p.stdout}\nstderr={p.stderr}")
    return json.loads(p.stdout)

def fp(obj): return hashlib.sha256(json.dumps(obj,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
def record(status='supported', materiality='medium', used=True, positive=True, expired=False):
    now=datetime.now(timezone.utc)
    return {'id':'A-1','statement':'Contract id is a string','materiality':materiality,'status':status,'owner':'curator','created_at':(now-timedelta(minutes=5)).isoformat(),'expires_at':(now-timedelta(minutes=1) if expired else now+timedelta(hours=1)).isoformat(),'revalidate_on':['base-revision-change'],'evidence_targets':['contract.json'],'evidence':[{'kind':'repository','reference':'contract.json','supports':positive,'observed_at':now.isoformat()}] if positive else [],'used_by':['plan:P1'] if used else []}

def main():
    policy=json.loads(POLICY.read_text())
    with tempfile.TemporaryDirectory() as td:
        td=Path(td); f=td/'a.json'
        f.write_text(json.dumps([record()]))
        r=run([EVAL,f,POLICY],0); assert r['status']=='verified'
        f.write_text(json.dumps([record(status='proposed',materiality='high')]))
        r=run([EVAL,f,POLICY],3); assert r['status']=='blocked'
        f.write_text(json.dumps([record(status='supported',materiality='high')]))
        r=run([EVAL,f,POLICY],0)
        report=td/'report.json'; report.write_text(json.dumps(r))
        items=json.loads(f.read_text())
        review={'reviewer':'verifier','decision':'approve','assumption_fingerprint':fp(items),'policy_fingerprint':fp(policy),'reviewed_ids':['A-1'],'evidence':['contract.json']}
        rev=td/'review.json'; rev.write_text(json.dumps(review))
        out=run([FINAL,report,f,POLICY,'--actor','implementer','--review',rev],0); assert out['status']=='verified'
        review['reviewer']='implementer'; rev.write_text(json.dumps(review))
        out=run([FINAL,report,f,POLICY,'--actor','implementer','--review',rev],3); assert out['status']=='blocked'
        f.write_text(json.dumps([record(expired=True)]))
        r=run([EVAL,f,POLICY],2); assert r['status']=='review-required'
    print('smoke-test: ok')
    return 0
if __name__=='__main__': sys.exit(main())
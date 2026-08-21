#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPTS=ROOT/'scripts'; POLICY=ROOT/'config'/'consensus-policy.json'

def run(args, expect):
    p=subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
    if p.returncode!=expect:
        raise AssertionError(f"expected {expect}, got {p.returncode}\nstdout={p.stdout}\nstderr={p.stderr}")
    return p.stdout

def write(path,obj): path.write_text(json.dumps(obj,indent=2),encoding='utf-8')

def base(round_no=1,status='open',risk='medium'):
    return {
      'disagreement_id':'case-1','subject':'choose safe implementation','risk':risk,'round':round_no,
      'participants':['planner','reviewer'],
      'positions':[
        {'agent':'planner','claim':'option A is correct','recommended_action':'A','evidence_ids':['e1']},
        {'agent':'reviewer','claim':'option B is safer','recommended_action':'B','evidence_ids':['e2']}],
      'evidence_fingerprint':'a'*64,'new_evidence_ids':[] if round_no==1 else ['e3'],'status':status,'resolution':None}

def main():
  with tempfile.TemporaryDirectory() as td:
    td=Path(td); cur=td/'cur.json'; prev=td/'prev.json'; review=td/'review.json'
    d=base(); write(cur,d)
    run([SCRIPTS/'validate-disagreement.py',cur],0)

    # no-progress round escalates
    p=base(); write(prev,p); d2=base(2); d2['evidence_fingerprint']='a'*64; write(cur,d2)
    out=run([SCRIPTS/'evaluate-deadlock.py',cur,'--previous',prev,'--policy',POLICY],1)
    assert 'human-decision-required' in out

    # resolved low-risk passes final gate
    d=base(status='resolved'); d['resolution']={'mode':'evidence-dominates','reason':'test evidence falsified option B'}; write(cur,d)
    out=run([SCRIPTS/'evaluate-final-gate.py',cur,'--policy',POLICY,'--planner','planner'],0)
    assert 'verified' in out

    # high-risk self-review fails
    d=base(status='resolved',risk='high'); d['resolution']={'mode':'independent-verifier','reason':'independent verification required'}; write(cur,d)
    import hashlib
    x=dict(d); x.pop('resolution',None)
    fp=hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
    write(review,{'disagreement_id':'case-1','reviewer':'planner','decision':'approved','disagreement_fingerprint':fp,'reason':'approved','evidence_ids':['e4']})
    out=run([SCRIPTS/'evaluate-final-gate.py',cur,'--policy',POLICY,'--review',review,'--planner','planner'],1)
    assert 'self-review' in out

    # max rounds escalates
    d=base(4); d['evidence_fingerprint']='c'*64; write(cur,d)
    out=run([SCRIPTS/'evaluate-deadlock.py',cur,'--policy',POLICY],1)
    assert 'max rounds exceeded' in out
  print('smoke tests passed')
  return 0
if __name__=='__main__': raise SystemExit(main())

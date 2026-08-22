#!/usr/bin/env python3
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
EVAL=ROOT/'scripts'/'evaluate-resolution.py'
GATE=ROOT/'scripts'/'verify-final-gate.py'
POLICY=ROOT/'config'/'conflict-policy.json'

def sig(line): return hashlib.sha256(line.strip().encode()).hexdigest()[:16]
def run(*args): return subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
def write(path,obj): Path(path).write_text(json.dumps(obj,indent=2)+'\n',encoding='utf-8')

def case_clean(tmp):
 p=Path(tmp); (p/'src').mkdir(); (p/'src/service.py').write_text('return cached_value\nreturn await load_value()\n')
 inv={'version':'1.0','repository_revision':'abcdef1234567','conflicts':[{'id':'src/service.py#1','file':'src/service.py','start_line':1,'end_line':5,'ours':'return cached_value','theirs':'return await load_value()','base':'return value','risk':'medium','side_signatures':{'ours':[sig('return cached_value')],'theirs':[sig('return await load_value()')]}}]}
 dec={'version':'1.0','repository_revision':'abcdef1234567','resolutions':[{'conflict_id':'src/service.py#1','rationale':'Preserve cache behavior and the new load fallback together.','preserved':['both'],'targeted_checks':['pytest tests/test_service.py'],'approval_action':None,'notes':[]}]}
 write(p/'inv.json',inv); write(p/'dec.json',dec)
 r=run(EVAL,'--inventory',p/'inv.json','--resolution',p/'dec.json','--policy',POLICY,'--root',p,'--output',p/'report.json'); assert r.returncode==0,r.stderr+r.stdout
 g=run(GATE,'--report',p/'report.json','--inventory',p/'inv.json','--policy',POLICY,'--actor','agent-a'); assert g.returncode==0,g.stderr+g.stdout

def case_marker_blocks(tmp):
 p=Path(tmp); (p/'src').mkdir(); (p/'src/a.py').write_text('<<<<<<< ours\nx=1\n=======\nx=2\n>>>>>>> theirs\n')
 inv={'version':'1.0','repository_revision':'abcdef1234567','conflicts':[{'id':'src/a.py#1','file':'src/a.py','start_line':1,'end_line':5,'ours':'x=1','theirs':'x=2','base':'x=0','risk':'medium','side_signatures':{'ours':[sig('x=1')],'theirs':[sig('x=2')]}}]}
 dec={'version':'1.0','repository_revision':'abcdef1234567','resolutions':[{'conflict_id':'src/a.py#1','rationale':'Choose the intended merged value based on repository evidence.','preserved':['ours'],'targeted_checks':['pytest -k value'],'approval_action':None,'notes':[]}]}
 write(p/'inv.json',inv); write(p/'dec.json',dec); r=run(EVAL,'--inventory',p/'inv.json','--resolution',p/'dec.json','--policy',POLICY,'--root',p,'--output',p/'report.json'); assert r.returncode==2

def case_missing_signature_blocks(tmp):
 p=Path(tmp); (p/'src').mkdir(); (p/'src/b.py').write_text('replacement_behavior()\n')
 inv={'version':'1.0','repository_revision':'abcdef1234567','conflicts':[{'id':'src/b.py#1','file':'src/b.py','start_line':1,'end_line':5,'ours':'old_behavior()','theirs':'new_behavior()','base':'base_behavior()','risk':'medium','side_signatures':{'ours':[sig('old_behavior()')],'theirs':[sig('new_behavior()')]}}]}
 dec={'version':'1.0','repository_revision':'abcdef1234567','resolutions':[{'conflict_id':'src/b.py#1','rationale':'Claims to preserve ours but the resolved file intentionally lacks its signature.','preserved':['ours'],'targeted_checks':['pytest -k behavior'],'approval_action':None,'notes':[]}]}
 write(p/'inv.json',inv); write(p/'dec.json',dec); r=run(EVAL,'--inventory',p/'inv.json','--resolution',p/'dec.json','--policy',POLICY,'--root',p,'--output',p/'report.json'); assert r.returncode==2

def case_high_review(tmp):
 p=Path(tmp); (p/'security').mkdir(); (p/'security/auth.py').write_text('allow_if_valid()\n')
 inv={'version':'1.0','repository_revision':'abcdef1234567','conflicts':[{'id':'security/auth.py#1','file':'security/auth.py','start_line':1,'end_line':5,'ours':'allow_if_valid()','theirs':'deny_if_invalid()','base':'authorize()','risk':'high','side_signatures':{'ours':[sig('allow_if_valid()')],'theirs':[sig('deny_if_invalid()')]}}]}
 dec={'version':'1.0','repository_revision':'abcdef1234567','resolutions':[{'conflict_id':'security/auth.py#1','rationale':'Preserve the validated allow path while another change is intentionally excluded with evidence.','preserved':['ours'],'targeted_checks':['pytest tests/security'],'approval_action':None,'notes':[]}]}
 write(p/'inv.json',inv); write(p/'dec.json',dec); r=run(EVAL,'--inventory',p/'inv.json','--resolution',p/'dec.json','--policy',POLICY,'--root',p,'--output',p/'report.json'); assert r.returncode==3
 report=json.load(open(p/'report.json'))
 review={'version':'1.0','status':'approved','reviewer_id':'agent-b','reviewed_at_utc':'2026-08-17T15:00:00Z','report_fingerprint':report['report_fingerprint'],'findings':['independent review']}; write(p/'review.json',review)
 g=run(GATE,'--report',p/'report.json','--inventory',p/'inv.json','--policy',POLICY,'--review',p/'review.json','--actor','agent-a'); assert g.returncode==0
 review['reviewer_id']='agent-a'; write(p/'review.json',review); g=run(GATE,'--report',p/'report.json','--inventory',p/'inv.json','--policy',POLICY,'--review',p/'review.json','--actor','agent-a'); assert g.returncode==2

def main():
 for fn in (case_clean,case_marker_blocks,case_missing_signature_blocks,case_high_review):
  with tempfile.TemporaryDirectory() as d: fn(d)
 print('smoke-test: PASS')
if __name__=='__main__': main()

#!/usr/bin/env python3
import json, subprocess, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
EVAL=ROOT/'scripts/evaluate-isolation.py'
GATE=ROOT/'scripts/verify-final-gate.py'
POLICY=ROOT/'config/worktree-policy.json'


def run(args, expected):
    p=subprocess.run(args,text=True,capture_output=True)
    if p.returncode!=expected:
        raise AssertionError(f'expected {expected}, got {p.returncode}: {p.stdout} {p.stderr}')
    return p


def dump(path,obj): path.write_text(json.dumps(obj,indent=2)+'\n',encoding='utf-8')

def base_session(tmp,risk='medium',session_id='s1'):
    return {'version':'1.0','session_id':session_id,'actor_id':'actor-a','repository':'example/repo','base_revision':'a'*40,'branch':f'agent/{session_id}','worktree_path':str(tmp/f'wt-{session_id}'),'started_at_utc':'2026-08-17T14:00:00Z','allowed_paths':['src/orders/**','tests/orders/**'],'dirty_at_start':False,'risk':risk}

def state(tmp,session,dirty=False):
    return {'repository_root':str(tmp),'worktree_path':session['worktree_path'],'branch':session['branch'],'head_revision':'b'*40,'dirty':dirty,'status_lines':[],'worktree_porcelain':[]}

def evaluate(tmp,name,session,changed,active=None,expected=0,phase='final',dirty=False):
    sp=tmp/f'{name}-session.json'; st=tmp/f'{name}-state.json'; cp=tmp/f'{name}-changed.txt'; rp=tmp/f'{name}-report.json'
    dump(sp,session); dump(st,state(tmp,session,dirty)); cp.write_text('\n'.join(changed)+'\n',encoding='utf-8')
    args=['python3',str(EVAL),'--session',str(sp),'--state',str(st),'--policy',str(POLICY),'--changed-paths',str(cp),'--phase',phase,'--output',str(rp)]
    if active is not None:
        ap=tmp/f'{name}-active.json'; dump(ap,active); args += ['--active-sessions',str(ap)]
    run(args,expected); return sp,rp

def main():
    with tempfile.TemporaryDirectory() as d:
        tmp=Path(d)
        session=base_session(tmp,'medium','clean')
        sp,rp=evaluate(tmp,'clean',session,['src/orders/OrderService.cs'],expected=0)
        run(['python3',str(GATE),'--report',str(rp),'--session',str(sp),'--policy',str(POLICY)],0)

        # Working-phase evidence cannot be used as final verification evidence.
        wsp,wrp=evaluate(tmp,'working',session,['src/orders/OrderService.cs'],expected=0,phase='working')
        run(['python3',str(GATE),'--report',str(wrp),'--session',str(wsp),'--policy',str(POLICY)],2)

        # Dirty final handoff blocks when policy requires a clean handoff.
        evaluate(tmp,'dirty-final',session,['src/orders/OrderService.cs'],expected=2,dirty=True)

        # Out-of-scope edit is a deterministic blocker.
        bsp,blocked=evaluate(tmp,'scope',session,['src/orders/OrderService.cs','src/billing/Billing.cs'],expected=2)
        run(['python3',str(GATE),'--report',str(blocked),'--session',str(bsp),'--policy',str(POLICY)],2)

        # Shared branch with another active session blocks.
        active=[{'session_id':'other','branch':session['branch'],'worktree_path':str(tmp/'wt-other'),'changed_paths':['src/billing/Billing.cs']}]
        evaluate(tmp,'shared',session,['src/orders/OrderService.cs'],active=active,expected=2)

        # High-risk session requires independent fingerprint-bound approval.
        high=base_session(tmp,'high','high')
        hp,hr=evaluate(tmp,'high',high,['src/orders/OrderService.cs'],expected=3)
        report=json.loads(hr.read_text(encoding='utf-8'))
        self_review=tmp/'self-review.json'; dump(self_review,{'version':'1.0','report_fingerprint':report['fingerprint'],'reviewer_id':'actor-a','status':'approved','rationale':'checked','reviewed_at_utc':'2026-08-17T14:30:00Z'})
        run(['python3',str(GATE),'--report',str(hr),'--session',str(hp),'--policy',str(POLICY),'--review',str(self_review)],2)
        review=tmp/'review.json'; dump(review,{'version':'1.0','report_fingerprint':report['fingerprint'],'reviewer_id':'reviewer-b','status':'approved','rationale':'independent isolation verification','reviewed_at_utc':'2026-08-17T14:31:00Z'})
        run(['python3',str(GATE),'--report',str(hr),'--session',str(hp),'--policy',str(POLICY),'--review',str(review)],0)

        # Policy mutation invalidates an otherwise clean report.
        mutated=tmp/'policy.json'; pol=json.loads(POLICY.read_text(encoding='utf-8')); pol['require_clean_handoff']=False; dump(mutated,pol)
        run(['python3',str(GATE),'--report',str(rp),'--session',str(sp),'--policy',str(mutated)],2)

        # Report tampering invalidates integrity even if status is left non-blocked.
        tampered=tmp/'tampered.json'; obj=json.loads(rp.read_text(encoding='utf-8')); obj['changed_paths'].append('src/orders/Tampered.cs'); dump(tampered,obj)
        run(['python3',str(GATE),'--report',str(tampered),'--session',str(sp),'--policy',str(POLICY)],2)
    print('smoke tests passed')

if __name__=='__main__': main()

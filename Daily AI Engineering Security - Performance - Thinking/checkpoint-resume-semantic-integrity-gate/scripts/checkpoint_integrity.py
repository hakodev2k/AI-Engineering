#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load_rows(path):
    rows=[]
    for i,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        try: rows.append(json.loads(line))
        except Exception as e: raise ValueError(f'line {i}: {e}')
    return rows

def validate(rows, expected_signature=None, expected_executors=None):
    cps={}
    resumes=[]
    violations=[]
    for i,r in enumerate(rows,1):
        if not isinstance(r,dict):
            violations.append(f'row_{i}:not_object'); continue
        kind=r.get('event','checkpoint')
        if kind=='resume':
            resumes.append(r); continue
        cid=r.get('checkpoint_id')
        if not cid:
            violations.append(f'row_{i}:missing_checkpoint_id'); continue
        if cid in cps:
            violations.append(f'duplicate_checkpoint_id:{cid}')
        cps[cid]=r
        sig=r.get('workflow_signature')
        if expected_signature and sig!=expected_signature:
            violations.append(f'workflow_signature_mismatch:{cid}')
        if expected_executors is not None:
            got=sorted(r.get('executor_ids',[]))
            if got!=sorted(expected_executors): violations.append(f'executor_identity_mismatch:{cid}')
        pending=set(r.get('pending_request_ids',[])); answered=set(r.get('answered_request_ids',[]))
        overlap=pending & answered
        if overlap: violations.append(f'pending_answered_overlap:{cid}:'+','.join(sorted(overlap)))
    for cid,r in cps.items():
        parent=r.get('previous_checkpoint_id')
        if parent is not None and parent not in cps:
            violations.append(f'missing_parent:{cid}->{parent}')
        if parent in cps:
            pi=cps[parent].get('iteration'); ci=r.get('iteration')
            if isinstance(pi,int) and isinstance(ci,int) and ci<pi:
                violations.append(f'iteration_rollback:{cid}')
    for n,res in enumerate(resumes,1):
        restored=res.get('restored_checkpoint_id'); first=res.get('first_new_checkpoint_id')
        if restored not in cps: violations.append(f'resume_{n}:unknown_restored_checkpoint')
        if first not in cps: violations.append(f'resume_{n}:unknown_first_new_checkpoint')
        if first in cps and cps[first].get('previous_checkpoint_id')!=restored:
            violations.append(f'resume_{n}:ancestry_break')
        if restored in cps and first in cps:
            a=cps[restored]; b=cps[first]
            if a.get('workflow_signature')!=b.get('workflow_signature'):
                violations.append(f'resume_{n}:workflow_signature_changed')
            if sorted(a.get('executor_ids',[]))!=sorted(b.get('executor_ids',[])):
                violations.append(f'resume_{n}:executor_identity_changed')
            answered=set(a.get('answered_request_ids',[]))
            pending=set(b.get('pending_request_ids',[]))
            replay=answered & pending
            if replay: violations.append(f'resume_{n}:answered_request_replayed:'+','.join(sorted(replay)))
    return {'ok':not violations,'checkpoint_count':len(cps),'resume_count':len(resumes),'violations':sorted(set(violations))}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('trace'); ap.add_argument('--expected-signature'); ap.add_argument('--expected-executors',nargs='*'); ap.add_argument('--json-out')
    a=ap.parse_args()
    try:
        report=validate(load_rows(a.trace),a.expected_signature,a.expected_executors)
        text=json.dumps(report,indent=2,sort_keys=True); print(text)
        if a.json_out: Path(a.json_out).write_text(text+'\n',encoding='utf-8')
        return 0 if report['ok'] else 3
    except Exception as e:
        print(str(e),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())

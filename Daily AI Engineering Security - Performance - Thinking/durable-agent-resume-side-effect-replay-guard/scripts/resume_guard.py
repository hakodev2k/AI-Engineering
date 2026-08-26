#!/usr/bin/env python3
import argparse,json
from pathlib import Path
VALID={'not_started','in_flight','confirmed_complete','failed_before_effect','ambiguous'}
def load(path):
 try:return json.loads(Path(path).read_text(encoding='utf-8'))
 except Exception as exc: print(json.dumps({'ok':False,'error':f'invalid input: {exc}'})); raise SystemExit(2)
def evaluate(event):
 reasons=[]
 for k in ('workflow_id','checkpoint_id','operation'):
  if k not in event: reasons.append('missing:'+k)
 if reasons:return {'ok':False,'decision':'block','reasons':reasons}
 op=event.get('operation') or {}
 for k in ('operation_id','consequential','idempotent','ledger_status'):
  if k not in op: reasons.append('missing:operation.'+k)
 status=op.get('ledger_status')
 if status not in VALID: reasons.append('invalid:operation.ledger_status')
 if event.get('expected_parent_id') is not None and event.get('checkpoint_parent_id')!=event.get('expected_parent_id'): reasons.append('checkpoint_lineage_mismatch')
 if event.get('response_request_id') is not None and event.get('pending_request_id')!=event.get('response_request_id'): reasons.append('pending_request_id_mismatch')
 consequential=bool(op.get('consequential')); idempotent=bool(op.get('idempotent')); evidence=bool(op.get('external_evidence'))
 if status=='confirmed_complete': reasons.append('operation_already_complete_do_not_replay')
 elif status in {'in_flight','ambiguous'} and consequential and not idempotent: reasons.append('ambiguous_non_idempotent_side_effect')
 elif status=='in_flight' and consequential and idempotent and not evidence: reasons.append('in_flight_requires_external_reconciliation')
 if reasons:return {'ok':False,'decision':'block','operation_id':op.get('operation_id'),'reasons':sorted(set(reasons))}
 decision='allow_execute' if status in {'not_started','failed_before_effect'} else ('allow_idempotent_reconcile_or_retry' if status=='in_flight' and idempotent and evidence else 'allow_resume_without_replay')
 return {'ok':True,'decision':decision,'operation_id':op.get('operation_id'),'reasons':[]}
def main():
 p=argparse.ArgumentParser(); p.add_argument('--event',required=True); a=p.parse_args(); r=evaluate(load(a.event)); print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r['ok'] else 3
if __name__=='__main__': raise SystemExit(main())
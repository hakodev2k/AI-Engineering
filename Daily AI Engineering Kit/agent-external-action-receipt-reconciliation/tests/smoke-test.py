#!/usr/bin/env python3
import json, subprocess, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def run(args, expected):
    p=subprocess.run(args,capture_output=True,text=True); assert p.returncode==expected,(p.returncode,p.stdout,p.stderr); return p
def write(p,o): p.write_text(json.dumps(o),encoding='utf-8')
def main():
    policy=ROOT/'config/reconciliation-policy.json'
    with tempfile.TemporaryDirectory() as td:
        d=Path(td); ap=d/'attempt.json'; r1=d/'r1.json'; r2=d/'r2.json'; out=d/'rec.json'; final=d/'final.json'
        attempt={"version":"1.0","attempt_id":"a1","task_id":"t1","action_name":"create","risk":"medium","target_system":"svc","target_resource":"r1","idempotency_key":"idem-0001","request_fingerprint":"a"*64,"planned_at_utc":"2026-08-17T14:00:00Z","dangerous_action":False,"approval_fingerprint":None}; write(ap,attempt)
        unknown={"version":"1.0","attempt_id":"a1","idempotency_key":"idem-0001","request_fingerprint":"a"*64,"observed_at_utc":"2026-08-17T14:01:00Z","transport_status":"timeout","outcome":"unknown","external_receipt_id":None,"external_state_fingerprint":None,"evidence":["client timeout"]}; write(r1,unknown)
        run(['python3',str(ROOT/'scripts/evaluate-reconciliation.py'),str(ap),str(r1),'--policy',str(policy),'--output',str(out)],2); assert json.loads(out.read_text())['status']=='needs-probe'
        probe=dict(unknown); probe.update({"transport_status":"status-probe","outcome":"confirmed-success","external_receipt_id":"job-77","evidence":["authoritative status probe confirmed job-77"]}); write(r2,probe)
        run(['python3',str(ROOT/'scripts/evaluate-reconciliation.py'),str(ap),str(r1),str(r2),'--policy',str(policy),'--output',str(out)],0); assert json.loads(out.read_text())['decision']=='accept-success'
        run(['python3',str(ROOT/'scripts/verify-final-gate.py'),str(ap),str(out),'--policy',str(policy),'--output',str(final)],0); assert json.loads(final.read_text())['status']=='verified'
        high=dict(attempt); high['risk']='high'; hap=d/'high.json'; write(hap,high)
        run(['python3',str(ROOT/'scripts/verify-final-gate.py'),str(hap),str(out),'--policy',str(policy),'--output',str(final)],2); assert json.loads(final.read_text())['status']=='blocked'
    print('smoke tests passed')
if __name__=='__main__': main()

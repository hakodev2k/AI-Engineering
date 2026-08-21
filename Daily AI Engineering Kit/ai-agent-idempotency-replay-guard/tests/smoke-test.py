#!/usr/bin/env python3
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / 'config' / 'replay-policy.json'
VALIDATE = ROOT / 'scripts' / 'validate_operation_manifest.py'
GATE = ROOT / 'scripts' / 'evaluate_replay_gate.py'


def fingerprint(payload):
    raw=json.dumps(payload,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()


def run(args, expected):
    cp=subprocess.run([sys.executable, *map(str,args)],capture_output=True,text=True)
    if cp.returncode != expected:
        raise AssertionError(f'expected exit {expected}, got {cp.returncode}: {cp.stdout} {cp.stderr}')
    return json.loads(cp.stdout)


def manifest():
    payload={'entity_id':'42','action_value':'enabled'}
    return {
        'operation_key':'test:update-entity:42:v1',
        'action':'update-entity',
        'target_identity':'entity-42',
        'intent_version':'v1',
        'payload':payload,
        'payload_fingerprint':fingerprint(payload),
        'risk_category':'low',
        'executor_id':'smoke-executor',
        'provider':{'name':'fixture','native_idempotency_supported':True,'native_key_field':'Idempotency-Key','lookup_strategy':'lookup by entity id'},
        'verification':{'strategy':'read entity state','evidence_required':True},
        'retry':{'max_retries':1}
    }


def main():
    with tempfile.TemporaryDirectory() as td:
        d=Path(td); m=manifest(); mp=d/'manifest.json'; lp=d/'ledger.json'
        mp.write_text(json.dumps(m),encoding='utf-8'); lp.write_text('[]',encoding='utf-8')
        out=run([VALIDATE,'--manifest',mp,'--policy',POLICY],0); assert out['status']=='valid'
        out=run([GATE,'--manifest',mp,'--ledger',lp,'--policy',POLICY],0); assert out['decision']=='execute'

        success=[{'operation_key':m['operation_key'],'payload_fingerprint':m['payload_fingerprint'],'attempt':1,'state':'succeeded','result_ref':'fixture:42'}]
        lp.write_text(json.dumps(success),encoding='utf-8')
        out=run([GATE,'--manifest',mp,'--ledger',lp,'--policy',POLICY],0); assert out['decision']=='reuse-success'

        conflict=[{'operation_key':m['operation_key'],'payload_fingerprint':'0'*64,'attempt':1,'state':'succeeded'}]
        lp.write_text(json.dumps(conflict),encoding='utf-8')
        out=run([GATE,'--manifest',mp,'--ledger',lp,'--policy',POLICY],2); assert out['decision']=='blocked'

        ambiguous=[{'operation_key':m['operation_key'],'payload_fingerprint':m['payload_fingerprint'],'attempt':1,'state':'failed-unknown-outcome'}]
        lp.write_text(json.dumps(ambiguous),encoding='utf-8')
        out=run([GATE,'--manifest',mp,'--ledger',lp,'--policy',POLICY],3); assert out['decision']=='review-required'

        retryable=[{'operation_key':m['operation_key'],'payload_fingerprint':m['payload_fingerprint'],'attempt':1,'state':'failed-safe-to-retry'}]
        lp.write_text(json.dumps(retryable),encoding='utf-8')
        out=run([GATE,'--manifest',mp,'--ledger',lp,'--policy',POLICY],0); assert out['decision']=='safe-retry'

    print('smoke-test: PASS')

if __name__=='__main__': main()

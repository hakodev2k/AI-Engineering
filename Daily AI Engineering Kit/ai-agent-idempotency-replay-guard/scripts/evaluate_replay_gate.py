#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load(path, default):
    p=Path(path)
    return json.loads(p.read_text(encoding='utf-8')) if p.exists() else default


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--manifest',required=True); ap.add_argument('--ledger',required=True); ap.add_argument('--policy',required=True)
    a=ap.parse_args(); m=load(a.manifest,{}); ledger=load(a.ledger,[]); policy=load(a.policy,{})
    entries=[e for e in ledger if e.get('operation_key')==m.get('operation_key')]
    if not entries:
        print(json.dumps({'decision':'execute','reason':'no_prior_record'})); return 0
    conflicts=[e for e in entries if e.get('payload_fingerprint') and e.get('payload_fingerprint')!=m.get('payload_fingerprint')]
    if conflicts:
        print(json.dumps({'decision':'blocked','reason':'operation_key_payload_conflict'})); return 2
    latest=entries[-1]; state=latest.get('state')
    attempts=max([int(e.get('attempt',0)) for e in entries] or [0])
    if state=='succeeded':
        print(json.dumps({'decision':'reuse-success','reason':'already_succeeded','result':latest.get('result_ref')})); return 0
    if state=='failed-safe-to-retry':
        if attempts > int(policy.get('max_mutation_retries',1)):
            print(json.dumps({'decision':'blocked','reason':'retry_budget_exhausted'})); return 2
        print(json.dumps({'decision':'safe-retry','reason':'provider_proved_no_effect','attempts':attempts})); return 0
    if state in ('reserved','in-progress'):
        print(json.dumps({'decision':'review-required','reason':'operation_may_still_be_active'})); return 3
    if state=='failed-unknown-outcome':
        print(json.dumps({'decision':'review-required','reason':'ambiguous_prior_outcome'})); return 3
    if state in ('blocked','compensated'):
        print(json.dumps({'decision':'blocked','reason':state})); return 2
    print(json.dumps({'decision':'blocked','reason':'unknown_ledger_state','state':state})); return 2

if __name__=='__main__': sys.exit(main())

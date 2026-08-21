#!/usr/bin/env python3
import argparse, json, sys

def load(p):
    with open(p,'r',encoding='utf-8') as f: return json.load(f)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('attempt'); ap.add_argument('receipts', nargs='+'); ap.add_argument('--policy', required=True); ap.add_argument('--output'); a=ap.parse_args()
    try:
        attempt=load(a.attempt); policy=load(a.policy); receipts=[load(x) for x in a.receipts]
        errors=[]
        for r in receipts:
            if r.get('attempt_id') != attempt.get('attempt_id'): errors.append('receipt attempt_id mismatch')
            if r.get('idempotency_key') != attempt.get('idempotency_key'): errors.append('receipt idempotency_key mismatch')
            if r.get('request_fingerprint') != attempt.get('request_fingerprint'): errors.append('receipt request_fingerprint mismatch')
        outcomes=[r.get('outcome') for r in receipts]
        has_probe=any(r.get('transport_status')=='status-probe' for r in receipts)
        latest=outcomes[-1] if outcomes else 'unknown'
        status='open'; decision='human-decision-required'; reasons=[]
        if errors:
            status='blocked'; reasons.extend(errors)
        elif latest=='confirmed-success':
            status='resolved'; decision='accept-success'; reasons.append('external action confirmed successful')
        elif latest=='confirmed-failure':
            status='resolved'; decision='accept-failure'; reasons.append('external action confirmed failed')
        else:
            if policy.get('require_status_probe_for_unknown', True) and not has_probe:
                status='needs-probe'; reasons.append('unknown outcome requires status probe/read-back')
            else:
                status='human-decision-required'; reasons.append('outcome remains unknown after reconciliation')
        if latest=='unknown' and policy.get('forbid_retry_while_unknown', True): reasons.append('retry forbidden while outcome is unknown')
        if latest=='unknown' and policy.get('forbid_compensation_while_unknown', True): reasons.append('compensation forbidden while outcome is unknown')
        result={'status':status,'decision':decision,'latest_outcome':latest,'probe_observed':has_probe,'reasons':reasons}
        text=json.dumps(result,indent=2)
        if a.output: open(a.output,'w',encoding='utf-8').write(text+'\n')
        else: print(text)
        return 0 if status=='resolved' else 2
    except Exception as e:
        print(json.dumps({'error':str(e)}),file=sys.stderr); return 1
if __name__=='__main__': raise SystemExit(main())

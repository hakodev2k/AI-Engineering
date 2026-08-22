#!/usr/bin/env python3
import argparse, json, os, subprocess, sys
from datetime import datetime, timezone


def main():
    p=argparse.ArgumentParser()
    p.add_argument('--artifact', required=True)
    p.add_argument('--record', required=True)
    p.add_argument('--policy', default='config/artifact-policy.json')
    p.add_argument('--task-id', required=True)
    p.add_argument('--repository-id', required=True)
    p.add_argument('--verifier', required=True)
    p.add_argument('--notes', default='Independent integrity verification passed.')
    args=p.parse_args()
    cmd=[sys.executable, os.path.join(os.path.dirname(__file__),'verify-artifact.py'), '--artifact', args.artifact, '--record', args.record, '--policy', args.policy, '--task-id', args.task_id, '--repository-id', args.repository_id]
    result=subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        sys.stderr.write(result.stdout + result.stderr)
        return 10
    try: record=json.load(open(args.record,encoding='utf-8'))
    except Exception as e: print(f'record read error: {e}',file=sys.stderr); return 2
    if record.get('producer') == args.verifier:
        print('verifier must be independent of producer',file=sys.stderr); return 10
    record['integrity_status']='verified'
    record['verifier']=args.verifier
    record['verified_at']=datetime.now(timezone.utc).isoformat()
    record['verification_notes']=args.notes
    with open(args.record,'w',encoding='utf-8') as f: json.dump(record,f,indent=2)
    print(json.dumps({'artifact_id':record.get('artifact_id'),'integrity_status':'verified','verifier':args.verifier}))
    return 0

if __name__=='__main__': raise SystemExit(main())

#!/usr/bin/env python3
import argparse, json, os, shlex, subprocess, sys, time
from pathlib import Path


def load_config(path):
    data=json.loads(Path(path).read_text(encoding='utf-8'))
    if not isinstance(data.get('max_probe_runs'), int) or not 1 <= data['max_probe_runs'] <= 20:
        raise ValueError('max_probe_runs must be an integer from 1 to 20')
    return data


def allowed(command, prefixes):
    normalized=' '.join(shlex.split(command))
    return any(normalized == p or normalized.startswith(p+' ') for p in prefixes)


def main():
    ap=argparse.ArgumentParser(description='Run a bounded flakiness probe and preserve evidence.')
    ap.add_argument('--test-id', required=True)
    ap.add_argument('--command', required=True)
    ap.add_argument('--config', default='config/flake-gate.json')
    ap.add_argument('--out-dir')
    ap.add_argument('--runs', type=int)
    args=ap.parse_args()
    try:
        cfg=load_config(args.config)
    except Exception as e:
        print(f'config error: {e}', file=sys.stderr); return 3
    if not allowed(args.command, cfg['allowed_test_commands']):
        print('command is not allowed by config', file=sys.stderr); return 4
    runs=args.runs or cfg['max_probe_runs']
    if runs < 1 or runs > cfg['max_probe_runs']:
        print('runs exceeds configured bound', file=sys.stderr); return 4
    safe_id=''.join(c if c.isalnum() or c in '._-' else '_' for c in args.test_id)
    root=Path(args.out_dir or cfg['evidence_directory'])/safe_id
    root.mkdir(parents=True, exist_ok=True)
    records=[]
    for i in range(1, runs+1):
        start=time.monotonic()
        try:
            proc=subprocess.run(args.command, shell=True, text=True, capture_output=True, timeout=1800, env=os.environ.copy())
            duration=round(time.monotonic()-start, 3)
            (root/f'run-{i}.stdout.log').write_text(proc.stdout, encoding='utf-8')
            (root/f'run-{i}.stderr.log').write_text(proc.stderr, encoding='utf-8')
            rec={'run':i,'exit_code':proc.returncode,'duration_seconds':duration,'stdout':str(root/f'run-{i}.stdout.log'),'stderr':str(root/f'run-{i}.stderr.log')}
        except subprocess.TimeoutExpired as e:
            duration=round(time.monotonic()-start,3)
            (root/f'run-{i}.stdout.log').write_text(e.stdout or '', encoding='utf-8')
            (root/f'run-{i}.stderr.log').write_text(e.stderr or '', encoding='utf-8')
            rec={'run':i,'exit_code':124,'duration_seconds':duration,'stdout':str(root/f'run-{i}.stdout.log'),'stderr':str(root/f'run-{i}.stderr.log'),'tool_error':'timeout'}
        records.append(rec)
    passes=sum(r['exit_code']==0 for r in records); failures=len(records)-passes
    if passes and failures: status='flaky'
    elif failures==0: status='passed'
    elif all(r.get('tool_error') for r in records): status='tool-failure'
    else: status='consistent-failure'
    result={'test_id':args.test_id,'status':status,'runs':len(records),'passes':passes,'failures':failures,'evidence':[r['stdout'] for r in records]+[r['stderr'] for r in records], 'recommended_action':{'flaky':'investigate nondeterminism; quarantine only with approval','passed':'no flakiness reproduced','consistent-failure':'debug as deterministic failure','tool-failure':'repair environment/tooling then retry bounded probe'}[status], 'approval_required':status=='flaky' and cfg.get('quarantine_requires_approval', True)}
    (root/'runs.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
    (root/'result.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(json.dumps(result))
    return 2 if status in ('flaky','consistent-failure','tool-failure') else 0

if __name__=='__main__': sys.exit(main())

#!/usr/bin/env python3
"""Validate agent verification evidence against a machine-readable contract."""
import argparse, datetime as dt, json, pathlib, subprocess, sys

def now_utc(): return dt.datetime.now(dt.timezone.utc)
def parse_time(value):
    value = value.replace('Z', '+00:00')
    t = dt.datetime.fromisoformat(value)
    return t if t.tzinfo else t.replace(tzinfo=dt.timezone.utc)

def current_tree():
    try:
        return subprocess.check_output(['git','rev-parse','HEAD'], text=True, stderr=subprocess.DEVNULL).strip()
    except Exception:
        return None

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--contract', required=True); ap.add_argument('--evidence', required=True); ap.add_argument('--risk', choices=['low','medium','high'], required=True); ap.add_argument('--tree-sha'); args=ap.parse_args()
    try:
        contract=json.loads(pathlib.Path(args.contract).read_text()); records=json.loads(pathlib.Path(args.evidence).read_text())
    except Exception as exc:
        print(json.dumps({'status':'BLOCK','errors':[f'input error: {exc}']})); return 2
    if not isinstance(records, list): print(json.dumps({'status':'BLOCK','errors':['evidence must be an array']})); return 2
    tree=args.tree_sha or current_tree(); required=contract['risk_levels'][args.risk]; by_id={r.get('check_id'):r for r in records}; errors=[]; max_age=contract.get('evidence_max_age_seconds',1800)
    for check_id in required:
        r=by_id.get(check_id)
        if not r: errors.append(f'missing {check_id}'); continue
        expected=contract['checks'][check_id]
        for field in ('command','tree_sha','ended_at','exit_code','output_sha256','log_path'):
            if field not in r: errors.append(f'{check_id}: missing {field}')
        if r.get('command') != expected['command']: errors.append(f'{check_id}: command mismatch')
        if tree and r.get('tree_sha') != tree: errors.append(f'{check_id}: stale tree')
        if r.get('exit_code') != expected.get('required_exit_code',0): errors.append(f'{check_id}: failed exit code')
        try:
            if (now_utc()-parse_time(r['ended_at'])).total_seconds() > max_age: errors.append(f'{check_id}: stale evidence')
        except Exception: errors.append(f'{check_id}: invalid ended_at')
        log=r.get('log_path')
        if log and not pathlib.Path(log).exists(): errors.append(f'{check_id}: missing log artifact')
    result={'status':'PASS' if not errors else 'BLOCK','risk':args.risk,'tree_sha':tree,'required_checks':required,'errors':errors}
    print(json.dumps(result, indent=2)); return 0 if not errors else 3
if __name__=='__main__': raise SystemExit(main())

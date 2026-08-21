#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone
from pathlib import Path


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as e:
        print(f'ERROR: cannot load {path}: {e}', file=sys.stderr); sys.exit(2)


def parse_dt(value, field):
    try:
        return datetime.fromisoformat(value.replace('Z','+00:00'))
    except Exception:
        raise ValueError(f'{field} must be ISO-8601 date-time')


def main():
    p=argparse.ArgumentParser(); p.add_argument('--policy', required=True); p.add_argument('--evidence', required=True); a=p.parse_args()
    policy, ev = load(a.policy), load(a.evidence)
    errors=[]
    for f in ['release_id','environment','release_started_at','observation_started_at','metrics','smoke_tests_passed','data_integrity_passed']:
        if f not in ev: errors.append(f'missing required field: {f}')
    if errors:
        print('\n'.join('ERROR: '+x for x in errors)); return 1
    try:
        parse_dt(ev['release_started_at'],'release_started_at'); parse_dt(ev['observation_started_at'],'observation_started_at')
    except ValueError as e: errors.append(str(e))
    metrics={}
    for i,m in enumerate(ev.get('metrics',[])):
        missing=[x for x in ['name','unit','source','timestamp','baseline','current'] if x not in m]
        if missing: errors.append(f'metric[{i}] missing: {", ".join(missing)}'); continue
        try: ts=parse_dt(m['timestamp'],f'metric[{i}].timestamp')
        except ValueError as e: errors.append(str(e)); continue
        if not isinstance(m['baseline'],(int,float)) or not isinstance(m['current'],(int,float)): errors.append(f'metric[{i}] baseline/current must be numeric')
        metrics[m['name']]=m
        freshness=policy.get('metric_freshness_minutes',5)
        age=(datetime.now(timezone.utc)-ts.astimezone(timezone.utc)).total_seconds()/60
        if age > freshness: errors.append(f'metric {m["name"]} is stale: {age:.1f}m > {freshness}m')
    for name in policy.get('required_metrics',[]):
        if name not in metrics: errors.append(f'missing required metric: {name}')
    if errors:
        print('\n'.join('ERROR: '+x for x in errors)); return 1
    print(f'PASS: release evidence valid for {ev["release_id"]} with {len(metrics)} metrics')
    return 0

if __name__=='__main__': sys.exit(main())
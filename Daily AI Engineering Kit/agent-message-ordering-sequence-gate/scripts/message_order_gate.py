#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    with open(path, encoding='utf-8') as f: return json.load(f)

def evaluate(evidence, policy):
    errors=[]; warnings=[]
    events=evidence.get('events', [])
    if not events: errors.append('events must not be empty')
    groups={}
    for i,e in enumerate(events):
        for k in ('message_id','partition_key','sequence'):
            if k not in e: errors.append(f'events[{i}] missing {k}')
        if not all(k in e for k in ('message_id','partition_key','sequence')): continue
        if not isinstance(e['sequence'], int): errors.append(f"events[{i}].sequence must be integer"); continue
        groups.setdefault(e['partition_key'], []).append(e)
    findings=[]
    for key,items in groups.items():
        seen={}; previous=None
        for e in items:
            seq=e['sequence']; mid=e['message_id']
            if seq in seen:
                findings.append({'type':'duplicate_sequence','partition_key':key,'sequence':seq,'message_ids':[seen[seq],mid]})
                if not policy.get('allow_duplicates',True): errors.append(f'duplicate sequence {seq} in {key}')
            else: seen[seq]=mid
            if previous is not None:
                if seq < previous: findings.append({'type':'out_of_order','partition_key':key,'previous':previous,'actual':seq}); errors.append(f'out of order in {key}: {previous}->{seq}')
                elif seq-previous-1 > policy.get('max_gap',0): findings.append({'type':'gap','partition_key':key,'previous':previous,'actual':seq,'gap':seq-previous-1}); errors.append(f'gap in {key}: {previous}->{seq}')
            previous=seq
    return {'status':'pass' if not errors else 'block','errors':errors,'warnings':warnings,'findings':findings,'partitions':len(groups),'event_count':len(events)}

def main():
    p=argparse.ArgumentParser(); p.add_argument('--evidence',required=True); p.add_argument('--policy',required=True); p.add_argument('--output')
    a=p.parse_args()
    try: result=evaluate(load(a.evidence),load(a.policy))
    except (OSError,json.JSONDecodeError) as ex: print(f'input error: {ex}',file=sys.stderr); return 2
    text=json.dumps(result,indent=2); print(text)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    return 0 if result['status']=='pass' else 1
if __name__=='__main__': raise SystemExit(main())

#!/usr/bin/env python3
import argparse, json, sys
from collections import defaultdict

def main():
    p=argparse.ArgumentParser(description='Analyze NDJSON agent spawn/usage trace for fan-out and token pressure')
    p.add_argument('trace'); p.add_argument('--planned-descendants',type=int); p.add_argument('--planned-depth',type=int); p.add_argument('--planned-tokens',type=int)
    a=p.parse_args(); parents={}; children=defaultdict(list); tokens=0; spawns=0; active=0; peak=0; errors=0
    try:
        with open(a.trace,encoding='utf-8') as f:
            for n,line in enumerate(f,1):
                if not line.strip(): continue
                try: e=json.loads(line)
                except json.JSONDecodeError as ex: print(json.dumps({'error':f'line {n}: {ex}'}),file=sys.stderr); return 2
                typ=e.get('type')
                if typ=='spawn':
                    child=e.get('child'); parent=e.get('parent','root')
                    if not child: errors+=1; continue
                    parents[child]=parent; children[parent].append(child); spawns+=1; active+=1; peak=max(peak,active)
                elif typ in ('complete','failed','cancelled','timed_out'):
                    active=max(0,active-1)
                tokens+=int(e.get('tokens',0) or 0)
        def depth(node,seen=None):
            seen=set() if seen is None else seen
            if node in seen: return 10**6
            if node not in parents: return 0
            seen.add(node); return 1+depth(parents[node],seen)
        max_depth=max([depth(x) for x in parents] or [0])
        report={'spawns':spawns,'unique_agents':len(parents),'max_depth':max_depth,'peak_concurrency':peak,'tokens':tokens,'malformed_events':errors,'top_parents':sorted(((k,len(v)) for k,v in children.items()),key=lambda x:x[1],reverse=True)[:10]}
        violations=[]
        if a.planned_descendants is not None and spawns>a.planned_descendants: violations.append('descendants_above_plan')
        if a.planned_depth is not None and max_depth>a.planned_depth: violations.append('depth_above_plan')
        if a.planned_tokens is not None and tokens>a.planned_tokens: violations.append('tokens_above_plan')
        report['violations']=violations; print(json.dumps(report,indent=2)); return 3 if violations else 0
    except OSError as e:
        print(json.dumps({'error':str(e)}),file=sys.stderr); return 2

if __name__=='__main__': sys.exit(main())
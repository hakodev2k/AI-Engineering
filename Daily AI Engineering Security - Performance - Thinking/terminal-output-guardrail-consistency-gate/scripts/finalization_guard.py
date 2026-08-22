#!/usr/bin/env python3
"""Validate terminal-output persistence and tool-call/result integrity fixtures.
Exit 0 pass, 2 invalid input, 3 contract violation.
Fixture format: JSON array of objects with keys:
name, expected_persist_candidate(bool), actual_persist_candidate(bool),
tool_calls(list[str]), tool_results(list[str]), optional duplicate_terminal_records(int).
"""
from __future__ import annotations
import json, sys
from pathlib import Path


def load(path: Path):
    try:
        data=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc:
        raise ValueError(f'cannot read fixture: {exc}') from exc
    if not isinstance(data,list) or not data:
        raise ValueError('fixture must be a non-empty JSON array')
    return data


def analyze(rows):
    violations=[]
    for i,row in enumerate(rows,1):
        if not isinstance(row,dict): raise ValueError(f'row {i} must be object')
        name=row.get('name')
        if not isinstance(name,str) or not name: raise ValueError(f'row {i}: name required')
        for key in ('expected_persist_candidate','actual_persist_candidate'):
            if not isinstance(row.get(key),bool): raise ValueError(f'{name}: {key} must be boolean')
        calls=row.get('tool_calls',[]); results=row.get('tool_results',[])
        if not isinstance(calls,list) or not all(isinstance(x,str) and x for x in calls): raise ValueError(f'{name}: tool_calls invalid')
        if not isinstance(results,list) or not all(isinstance(x,str) and x for x in results): raise ValueError(f'{name}: tool_results invalid')
        if row['expected_persist_candidate'] != row['actual_persist_candidate']:
            violations.append({'fixture':name,'type':'candidate_persistence_mismatch','expected':row['expected_persist_candidate'],'actual':row['actual_persist_candidate']})
        call_set=set(calls); result_set=set(results)
        for call_id in sorted(call_set-result_set): violations.append({'fixture':name,'type':'orphan_tool_call','call_id':call_id})
        for result_id in sorted(result_set-call_set): violations.append({'fixture':name,'type':'orphan_tool_result','call_id':result_id})
        if len(calls)!=len(call_set): violations.append({'fixture':name,'type':'duplicate_tool_call_id'})
        if len(results)!=len(result_set): violations.append({'fixture':name,'type':'duplicate_tool_result_id'})
        dup=row.get('duplicate_terminal_records',0)
        if not isinstance(dup,int) or dup<0: raise ValueError(f'{name}: duplicate_terminal_records must be non-negative int')
        if dup: violations.append({'fixture':name,'type':'duplicate_terminal_records','count':dup})
    return {'fixtures':len(rows),'violations':violations,'verified':not violations}


def main():
    if len(sys.argv)!=2:
        print('usage: finalization_guard.py fixtures.json',file=sys.stderr); return 2
    try: report=analyze(load(Path(sys.argv[1])))
    except ValueError as exc:
        print(json.dumps({'verified':False,'error':str(exc)}),file=sys.stderr); return 2
    print(json.dumps(report,indent=2))
    return 0 if report['verified'] else 3

if __name__=='__main__': raise SystemExit(main())

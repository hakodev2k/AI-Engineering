#!/usr/bin/env python3
import json, sys
FIELDS={
 'readOnlyHint':('readOnlyHint','read_only_hint'),
 'destructiveHint':('destructiveHint','destructive_hint'),
 'idempotentHint':('idempotentHint','idempotent_hint'),
 'openWorldHint':('openWorldHint','open_world_hint')}
def getv(obj,names):
    for n in names:
        if isinstance(obj,dict) and n in obj:return obj[n]
        if hasattr(obj,n):return getattr(obj,n)
    return None
def normalize(obj):
    ann=getv(obj,('annotations',))
    if ann is None: ann={}
    out={k:getv(ann,n) for k,n in FIELDS.items()}
    for k,v in out.items():
        if v is not None and not isinstance(v,bool):
            raise ValueError(f'{k} must be boolean or absent')
    warnings=[]
    if out['readOnlyHint'] is True and out['destructiveHint'] is True:
        warnings.append('contradictory: readOnlyHint=true and destructiveHint=true')
    unknown=all(v is None for v in out.values())
    if unknown or warnings or out['destructiveHint'] is True or out['openWorldHint'] is True:
        risk='approval-required'
    elif out['readOnlyHint'] is True:
        risk='read-only-candidate'
    else:
        risk='approval-required'
    return {'annotations':out,'complete':not unknown,'warnings':warnings,'risk':risk}
def main():
    if len(sys.argv)!=2:
        print('usage: annotation_guard.py tool.json',file=sys.stderr);return 2
    try:
        with open(sys.argv[1],encoding='utf-8') as f: obj=json.load(f)
        print(json.dumps(normalize(obj),indent=2,sort_keys=True));return 0
    except (OSError,json.JSONDecodeError,ValueError) as e:
        print(f'error: {e}',file=sys.stderr);return 2
if __name__=='__main__': raise SystemExit(main())
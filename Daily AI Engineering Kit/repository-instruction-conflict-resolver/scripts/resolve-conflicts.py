#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load(path):
    try: return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as e: raise SystemExit(f'ERROR: {path}: {e}')

def overlap(a,b):
    if a=='.' or b=='.': return True
    a=a.strip('/'); b=b.strip('/')
    return a==b or a.startswith(b+'/') or b.startswith(a+'/')

def conflict(a,b):
    if a['subject']!=b['subject'] or a['action']!=b['action'] or not overlap(a['scope'],b['scope']): return False
    return {a['modality'],b['modality']} in ({'must','must-not'},{'should','must-not'})

def specificity(scope):
    return 0 if scope=='.' else len([p for p in scope.split('/') if p])

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--manifest',required=True); ap.add_argument('--policy',required=True); ap.add_argument('--out',required=True); a=ap.parse_args()
    m=load(a.manifest); p=load(a.policy)
    source={s['id']:s for s in m['sources']}; high=set(p.get('high_risk_subjects',[])); decisions={d['conflict_id']:d for d in m.get('human_decisions',[])}
    conflicts=[]; superseded=set(); blocking=False; human=False
    sts=m['statements']
    for i,x in enumerate(sts):
        for y in sts[i+1:]:
            if not conflict(x,y): continue
            sx,sy=source[x['source_id']],source[y['source_id']]
            cid='conflict:'+':'.join(sorted([x['id'],y['id']]))
            winner=None; reason=None
            if sx['authority']!=sy['authority']:
                winner=x if sx['authority']>sy['authority'] else y; reason='higher-authority'
            elif p.get('scope_rules',{}).get('nested_more_specific_when_equal_authority',True) and specificity(x['scope'])!=specificity(y['scope']):
                winner=x if specificity(x['scope'])>specificity(y['scope']) else y; reason='more-specific-scope'
            elif cid in decisions:
                chosen=decisions[cid]['decision']; winner=next((z for z in (x,y) if z['id']==chosen),None); reason='human-decision'
            if winner:
                loser=y if winner is x else x; superseded.add(loser['id']); status='resolved'
            else:
                status='human-review-required'; human=True
                if x['subject'] in high or y['subject'] in high: status='blocked'; blocking=True
            conflicts.append({'id':cid,'statement_ids':[x['id'],y['id']],'status':status,'winner':winner['id'] if winner else None,'reason':reason})
    effective=[s for s in sts if s['id'] not in superseded]
    status='blocked' if blocking else ('human-review-required' if human else 'verified-pending-review')
    out={'status':status,'effective':effective,'superseded':sorted(superseded),'conflicts':conflicts,'source_hashes':{s['path']:s['sha256'] for s in m['sources']}}
    op=Path(a.out); op.parent.mkdir(parents=True,exist_ok=True); op.write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'status':status,'conflicts':len(conflicts),'effective':len(effective)}))
    if status in ('blocked','human-review-required'): sys.exit(3)

if __name__=='__main__': main()

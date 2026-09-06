#!/usr/bin/env python3
"""Static evidence collector and deterministic verifier for transactional outbox work.
Exit codes: 0 pass/verified, 2 policy failure, 3 input/tool error.
"""
from __future__ import annotations
import argparse, json, os, sys
from pathlib import Path

TEXT_EXT={'.py','.cs','.java','.kt','.js','.ts','.tsx','.go','.rs','.rb','.php','.sql','.yaml','.yml','.json','.toml','.xml','.md'}
SKIP={'.git','node_modules','bin','obj','dist','build','.venv','venv','.outbox'}

def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))

def write(path,data):
    p=Path(path); p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(data,indent=2,sort_keys=True)+'\n',encoding='utf-8')

def files(root):
    for base,dirs,names in os.walk(root):
        dirs[:]=[d for d in dirs if d not in SKIP]
        for name in names:
            p=Path(base)/name
            if p.suffix.lower() in TEXT_EXT and p.stat().st_size <= 2_000_000:
                yield p

def scan(args):
    root=Path(args.root)
    if not root.is_dir(): raise ValueError(f'root not found: {root}')
    policy=load(args.policy)
    required=policy.get('required_concepts',[])
    concepts={k:[] for k in required}; direct=[]
    txp=[x.lower() for x in policy.get('transaction_patterns',[])]
    outp=[x.lower() for x in policy.get('outbox_patterns',[])]
    pub=[x.lower() for x in policy.get('direct_publish_patterns',[])]
    for p in files(root):
        try: lines=p.read_text(encoding='utf-8',errors='ignore').splitlines()
        except OSError: continue
        rel=str(p.relative_to(root))
        for n,line in enumerate(lines,1):
            low=line.lower()
            for c in required:
                tokens={'outbox':outp,'transaction':txp,'event_id':['event_id','eventid','message_id','messageid'],'retry':['retry','attempt','next_attempt'],'delivered':['delivered','processed_at','sent_at'],'idempotent':['idempot','dedup','inbox']}.get(c,[c.lower()])
                if any(t in low for t in tokens) and len(concepts[c])<12:
                    concepts[c].append(f'{rel}:{n}')
            if any(x in low for x in pub) and len(direct)<20:
                direct.append(f'{rel}:{n}')
    findings=[]
    for c,ev in concepts.items():
        if not ev: findings.append({'id':f'missing-{c}','severity':'error','message':f'No repository evidence found for required concept: {c}','evidence':[]})
    if direct and concepts.get('transaction'):
        findings.append({'id':'direct-publish-review','severity':'warning','message':'Direct publish-like calls exist; verify they are not an uncoordinated second side effect in the business transaction path.','evidence':direct[:10]})
    blocking=[f for f in findings if f['severity']=='error']
    out={'status':'blocked' if blocking else 'pass','root':str(root),'concepts':concepts,'findings':findings}
    write(args.out,out); return 2 if blocking else 0

def verify(args):
    ev=load(args.evidence); sim=load(args.simulation); errors=[]
    if ev.get('status')!='pass': errors.append('evidence scan is not pass')
    for k,v in ev.get('concepts',{}).items():
        if not v: errors.append(f'missing evidence: {k}')
    if sim.get('status')!='pass': errors.append('delivery simulation did not pass')
    required={'commit_atomicity','crash_before_send','send_failure_retry','crash_after_send_before_mark','concurrent_claim'}
    got={x.get('name') for x in sim.get('scenarios',[]) if x.get('status')=='pass'}
    for name in sorted(required-got): errors.append(f'missing passing scenario: {name}')
    out={'status':'verified' if not errors else 'failed','errors':errors,'evidence':args.evidence,'simulation':args.simulation}
    write(args.out,out); return 0 if not errors else 2

def main():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest='cmd',required=True)
    s=sub.add_parser('scan'); s.add_argument('--root',default='.'); s.add_argument('--policy',required=True); s.add_argument('--out',required=True); s.set_defaults(fn=scan)
    v=sub.add_parser('verify'); v.add_argument('--evidence',required=True); v.add_argument('--simulation',required=True); v.add_argument('--out',required=True); v.set_defaults(fn=verify)
    a=ap.parse_args()
    try: return a.fn(a)
    except (OSError,ValueError,json.JSONDecodeError) as e:
        print(f'outbox_check: {e}',file=sys.stderr); return 3
if __name__=='__main__': sys.exit(main())

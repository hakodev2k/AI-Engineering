#!/usr/bin/env python3
import argparse, json, os, sys, tempfile, time, uuid
from pathlib import Path

OK=0; INVALID=2; WARN=3; DENIED=4; IOERR=5

def load_json(path):
    with open(path,'r',encoding='utf-8') as f: return json.load(f)

def atomic_write(path, data):
    p=Path(path); p.parent.mkdir(parents=True, exist_ok=True)
    fd,tmp=tempfile.mkstemp(prefix=p.name+'.', dir=str(p.parent), text=True)
    try:
        with os.fdopen(fd,'w',encoding='utf-8') as f:
            json.dump(data,f,indent=2,sort_keys=True); f.write('\n'); f.flush(); os.fsync(f.fileno())
        os.replace(tmp,p)
    finally:
        if os.path.exists(tmp): os.unlink(tmp)

def limits(policy): return policy['limits']

def init(args):
    policy=load_json(args.policy); lim=limits(policy)
    ledger={'version':1,'root_task_id':args.root,'created_at':int(time.time()),'frozen':False,
            'limits':lim,'actual':{'descendants':0,'tokens':0,'tool_calls':0},
            'agents':{'root':{'id':'root','parent':None,'depth':0,'can_delegate':True}},'reservations':{}}
    atomic_write(args.ledger,ledger); print(json.dumps({'status':'initialized','root':args.root})); return OK

def active_reservations(ledger):
    return [r for r in ledger['reservations'].values() if r['status']=='reserved']

def reserve(args):
    policy=load_json(args.policy); ledger=load_json(args.ledger); lim=limits(policy)
    if ledger.get('frozen'): print(json.dumps({'allowed':False,'reason':'root_frozen'})); return DENIED
    if args.request_id in ledger['reservations']:
        r=ledger['reservations'][args.request_id]
        print(json.dumps({'allowed':r['status']=='reserved','reason':'idempotent_replay','reservation':r})); return OK if r['status']=='reserved' else DENIED
    parent=ledger['agents'].get(args.parent)
    if not parent: print(json.dumps({'allowed':False,'reason':'unknown_parent'})); return DENIED
    if not parent.get('can_delegate',False): print(json.dumps({'allowed':False,'reason':'parent_cannot_delegate'})); return DENIED
    depth=parent['depth']+1
    proposed_desc=ledger['actual']['descendants']+len(active_reservations(ledger))+1
    reserved_tokens=sum(r['tokens'] for r in active_reservations(ledger))
    reserved_tools=sum(r['tool_calls'] for r in active_reservations(ledger))
    checks=[(depth<=lim['max_depth'],'max_depth'),(proposed_desc<=lim['max_descendants'],'max_descendants'),
            (len(active_reservations(ledger))+1<=lim['max_concurrency'],'max_concurrency'),
            (ledger['actual']['tokens']+reserved_tokens+args.tokens<=lim['max_estimated_tokens'],'max_estimated_tokens'),
            (ledger['actual']['tool_calls']+reserved_tools+args.tool_calls<=lim['max_tool_calls'],'max_tool_calls')]
    for good,reason in checks:
        if not good: print(json.dumps({'allowed':False,'reason':reason})); return DENIED
    rid=str(uuid.uuid4())
    can_delegate=bool(args.can_delegate and depth < lim['max_depth'])
    ledger['reservations'][args.request_id]={'reservation_id':rid,'request_id':args.request_id,'child':args.child,'parent':args.parent,'depth':depth,'tokens':args.tokens,'tool_calls':args.tool_calls,'status':'reserved','created_at':int(time.time()),'can_delegate':can_delegate}
    ledger['agents'][args.child]={'id':args.child,'parent':args.parent,'depth':depth,'can_delegate':can_delegate}
    atomic_write(args.ledger,ledger); print(json.dumps({'allowed':True,'reservation_id':rid,'child':args.child,'depth':depth})); return OK

def find_reservation(ledger,rid):
    for key,r in ledger['reservations'].items():
        if r['reservation_id']==rid: return key,r
    return None,None

def reconcile(args):
    ledger=load_json(args.ledger); key,r=find_reservation(ledger,args.reservation_id)
    if not r: print(json.dumps({'error':'unknown_reservation'})); return INVALID
    if r['status']!='reserved': print(json.dumps({'status':'already_reconciled','reservation_id':args.reservation_id})); return OK
    if args.tokens_used<0 or args.tool_calls_used<0: return INVALID
    ledger['actual']['tokens']+=args.tokens_used; ledger['actual']['tool_calls']+=args.tool_calls_used; ledger['actual']['descendants']+=1
    r['status']=args.status; r['tokens_used']=args.tokens_used; r['tool_calls_used']=args.tool_calls_used; r['completed_at']=int(time.time())
    atomic_write(args.ledger,ledger); print(json.dumps({'status':'reconciled','reservation_id':args.reservation_id})); return OK

def check(args):
    policy=load_json(args.policy); ledger=load_json(args.ledger); lim=limits(policy); soft=policy['response']['on_soft_threshold_percent']/100.0
    active=active_reservations(ledger); vals={'descendants':ledger['actual']['descendants']+len(active),'tokens':ledger['actual']['tokens']+sum(r['tokens'] for r in active),'tool_calls':ledger['actual']['tool_calls']+sum(r['tool_calls'] for r in active),'concurrency':len(active),'depth':max([a['depth'] for a in ledger['agents'].values()] or [0])}
    hard=vals['descendants']>lim['max_descendants'] or vals['tokens']>lim['max_estimated_tokens'] or vals['tool_calls']>lim['max_tool_calls'] or vals['concurrency']>lim['max_concurrency'] or vals['depth']>lim['max_depth']
    if hard:
        ledger['frozen']=True; atomic_write(args.ledger,ledger); print(json.dumps({'status':'hard_violation','values':vals})); return DENIED
    ratios=[vals['descendants']/lim['max_descendants'],vals['tokens']/lim['max_estimated_tokens'],vals['tool_calls']/lim['max_tool_calls'],vals['concurrency']/lim['max_concurrency']]
    status='soft_threshold' if max(ratios)>=soft else 'healthy'; print(json.dumps({'status':status,'values':vals})); return WARN if status=='soft_threshold' else OK

def finalize(args):
    policy=load_json(args.policy); ledger=load_json(args.ledger)
    rc=check(argparse.Namespace(policy=args.policy,ledger=args.ledger))
    if rc==DENIED: return DENIED
    active=active_reservations(ledger)
    if active: print(json.dumps({'status':'incomplete','active_reservations':len(active)})); return DENIED
    print(json.dumps({'status':'final','actual':ledger['actual'],'frozen':ledger['frozen']})); return OK

def plan_check(args):
    p=load_json(args.policy); plan=load_json(args.plan); lim=limits(p)
    ok=plan.get('max_depth',0)<=lim['max_depth'] and plan.get('descendants',0)<=lim['max_descendants'] and plan.get('concurrency',0)<=lim['max_concurrency'] and plan.get('estimated_tokens',0)<=lim['max_estimated_tokens'] and plan.get('tool_calls',0)<=lim['max_tool_calls']
    print(json.dumps({'valid':ok})); return OK if ok else DENIED

def parser():
    p=argparse.ArgumentParser(description='Deterministic subagent fan-out budget guard'); s=p.add_subparsers(dest='cmd',required=True)
    x=s.add_parser('init'); x.add_argument('--policy',required=True); x.add_argument('--root',required=True); x.add_argument('--ledger',required=True); x.set_defaults(fn=init)
    x=s.add_parser('reserve'); x.add_argument('--policy',required=True); x.add_argument('--ledger',required=True); x.add_argument('--root',required=True); x.add_argument('--parent',required=True); x.add_argument('--request-id',required=True); x.add_argument('--child',required=True); x.add_argument('--tokens',type=int,required=True); x.add_argument('--tool-calls',type=int,required=True); x.add_argument('--can-delegate',action='store_true'); x.set_defaults(fn=reserve)
    x=s.add_parser('reconcile'); x.add_argument('--ledger',required=True); x.add_argument('--reservation-id',required=True); x.add_argument('--tokens-used',type=int,required=True); x.add_argument('--tool-calls-used',type=int,required=True); x.add_argument('--status',choices=['completed','failed','cancelled','timed_out'],required=True); x.set_defaults(fn=reconcile)
    x=s.add_parser('check'); x.add_argument('--policy',required=True); x.add_argument('--ledger',required=True); x.set_defaults(fn=check)
    x=s.add_parser('finalize'); x.add_argument('--policy',required=True); x.add_argument('--ledger',required=True); x.set_defaults(fn=finalize)
    x=s.add_parser('plan-check'); x.add_argument('--policy',required=True); x.add_argument('--plan',required=True); x.set_defaults(fn=plan_check)
    return p

if __name__=='__main__':
    try: sys.exit(parser().parse_args().fn(parser().parse_args()))
    except (OSError, json.JSONDecodeError, KeyError, ValueError) as e:
        print(json.dumps({'error':str(e)}),file=sys.stderr); sys.exit(IOERR)
#!/usr/bin/env python3
import argparse, json, math, statistics, sys
from collections import defaultdict
from pathlib import Path

try:
    import yaml
except ImportError:
    print('PyYAML is required: pip install pyyaml', file=sys.stderr)
    sys.exit(2)

def load_yaml(path):
    with open(path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def load_events(path):
    events=[]
    with open(path, 'r', encoding='utf-8') as f:
        for i,line in enumerate(f,1):
            if not line.strip():
                continue
            try:
                e=json.loads(line)
            except json.JSONDecodeError as ex:
                raise ValueError(f'invalid JSON on line {i}: {ex}')
            for k in ('timestamp','provider','model','request_id','input_tokens','output_tokens','cost_usd'):
                if k not in e:
                    raise ValueError(f'line {i} missing {k}')
            if float(e['cost_usd']) < 0:
                raise ValueError(f'line {i} has negative cost')
            events.append(e)
    return events

def zscore(value, samples):
    if len(samples) < 2:
        return 0.0
    mean=statistics.mean(samples)
    sd=statistics.pstdev(samples)
    return 0.0 if sd == 0 else (value-mean)/sd

def evaluate(events, policy):
    findings=[]
    total=sum(float(e['cost_usd']) for e in events)
    soft=float(policy['soft_budget']); hard=float(policy['hard_budget'])
    if total >= hard:
        findings.append({'code':'HARD_BUDGET_EXCEEDED','severity':'critical','message':f'Total cost ${total:.4f} exceeds hard budget ${hard:.4f}','evidence':{'total_cost_usd':total}})
    elif total >= soft:
        findings.append({'code':'SOFT_BUDGET_EXCEEDED','severity':'high','message':f'Total cost ${total:.4f} exceeds soft budget ${soft:.4f}','evidence':{'total_cost_usd':total}})

    per_request=float(policy['per_request_max_cost'])
    for e in events:
        c=float(e['cost_usd'])
        if c > per_request:
            findings.append({'code':'REQUEST_COST_SPIKE','severity':'high','message':f"Request {e['request_id']} cost ${c:.4f} exceeds ${per_request:.4f}",'evidence':{'request_id':e['request_id'],'model':e['model'],'cost_usd':c}})

    user_limit=float(policy['per_user_daily_max_cost'])
    user_cost=defaultdict(float)
    for e in events:
        if e.get('user_id'):
            user_cost[e['user_id']]+=float(e['cost_usd'])
    for user,c in user_cost.items():
        if c > user_limit:
            findings.append({'code':'USER_BUDGET_EXCEEDED','severity':'high','message':f'User {user} cost ${c:.4f} exceeds ${user_limit:.4f}','evidence':{'user_id':user,'cost_usd':c}})

    a=policy.get('anomaly',{})
    lookback=int(a.get('lookback_points',24)); minimum=int(a.get('minimum_points',8))
    zs=float(a.get('z_score_threshold',3.0)); ratio=float(a.get('growth_ratio_threshold',2.5)); delta=float(a.get('minimum_cost_delta',0.5))
    costs=[float(e['cost_usd']) for e in events]
    if len(costs) >= minimum+1:
        history=costs[max(0,len(costs)-1-lookback):-1]
        current=costs[-1]
        mean=statistics.mean(history)
        score=zscore(current,history)
        growth=(current/mean) if mean > 0 else math.inf
        if current-mean >= delta and (score >= zs or growth >= ratio):
            findings.append({'code':'COST_ANOMALY','severity':'high','message':f'Latest request cost ${current:.4f} is anomalous versus baseline ${mean:.4f}','evidence':{'z_score':score,'growth_ratio':growth,'baseline_mean':mean,'current':current}})

    if any(f['code']=='HARD_BUDGET_EXCEEDED' for f in findings):
        status='needs-approval' if policy.get('approval',{}).get('required_for_hard_budget_override',True) else 'block'
    elif any(f['severity'] in ('high','critical') for f in findings):
        status='warn'
    else:
        status='pass'
    return {'status':status,'total_cost_usd':round(total,6),'soft_budget':soft,'hard_budget':hard,'findings':findings,'approval_required':status=='needs-approval'}

def main():
    p=argparse.ArgumentParser(description='Evaluate LLM usage cost against deterministic budgets and anomaly rules.')
    p.add_argument('--events',required=True,help='JSONL usage events')
    p.add_argument('--policy',required=True,help='YAML budget policy')
    p.add_argument('--output',help='Write result JSON to this path')
    p.add_argument('--fail-on-warn',action='store_true')
    args=p.parse_args()
    try:
        result=evaluate(load_events(args.events),load_yaml(args.policy))
    except Exception as ex:
        print(json.dumps({'status':'error','error':str(ex)}),file=sys.stderr)
        return 2
    text=json.dumps(result,indent=2,sort_keys=True)
    if args.output:
        Path(args.output).parent.mkdir(parents=True,exist_ok=True)
        Path(args.output).write_text(text+'\n',encoding='utf-8')
    print(text)
    if result['status'] in ('block','needs-approval'):
        return 3
    if args.fail_on_warn and result['status']=='warn':
        return 4
    return 0

if __name__=='__main__':
    sys.exit(main())

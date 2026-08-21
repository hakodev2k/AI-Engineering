#!/usr/bin/env python3
import argparse, hashlib, json, pathlib, sys

def load(path):
    try: return json.loads(pathlib.Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'invalid-json:{path}:{exc}',file=sys.stderr); raise SystemExit(2)

def canon(v): return json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def fp(v): return hashlib.sha256(canon(v).encode()).hexdigest()

p=argparse.ArgumentParser()
p.add_argument('--claims',required=True)
p.add_argument('--contamination',required=True)
p.add_argument('--policy',required=True)
p.add_argument('--mutation')
p.add_argument('--review')
p.add_argument('--implementation-owner',default='implementation-agent')
p.add_argument('--output',required=True)
a=p.parse_args()
claims=load(a.claims); contamination=load(a.contamination); policy=load(a.policy)
if not isinstance(claims,list): print('claims-must-be-array',file=sys.stderr); raise SystemExit(2)
expected_oracle_fp=fp({'claims':claims,'policy':policy}); expected_policy_fp=fp(policy)
blockers=list(contamination.get('blockers',[])); warnings=list(contamination.get('warnings',[]))
if contamination.get('oracle_fingerprint')!=expected_oracle_fp: blockers.append('stale-contamination-oracle-fingerprint')
if contamination.get('policy_fingerprint')!=expected_policy_fp: blockers.append('stale-contamination-policy-fingerprint')
high=any(c.get('risk') in set(policy.get('mutation',{}).get('required_for_risk',[])) for c in claims)
mutation={'required':high,'provided':False,'mutants':0,'killed':0,'kill_ratio':0.0}
if a.mutation:
    m=load(a.mutation); mutation['provided']=True
    try:
        mutants=int(m.get('mutants',0)); killed=int(m.get('killed',0)); ratio=(killed/mutants if mutants else 0.0)
    except Exception: print('invalid-mutation-report',file=sys.stderr); raise SystemExit(2)
    mutation.update({'mutants':mutants,'killed':killed,'kill_ratio':round(ratio,6)})
if high:
    mp=policy.get('mutation',{})
    if not mutation['provided']: blockers.append('required-mutation-evidence-missing')
    elif mutation['mutants']<int(mp.get('minimum_mutants',1)): blockers.append('mutation-count-below-minimum')
    elif mutation['kill_ratio']<float(mp.get('minimum_kill_ratio',0.0)): blockers.append('mutation-kill-ratio-below-minimum')
review_required=bool(warnings) or (high and policy.get('risk',{}).get('require_independent_reviewer_for_high_risk',True))
if not blockers and review_required:
    if not a.review:
        warnings.append('independent-review-required')
    else:
        review=load(a.review)
        if review.get('oracle_fingerprint')!=expected_oracle_fp: blockers.append('review-oracle-fingerprint-mismatch')
        if review.get('reviewer')==a.implementation_owner: blockers.append('self-review-not-allowed')
        if review.get('implementation_owner')!=a.implementation_owner: blockers.append('review-owner-mismatch')
        if review.get('verdict')!='approved': blockers.append('review-not-approved')
status='blocked' if blockers else ('review-required' if review_required and not a.review else 'verified')
result={'version':'1.0.0','status':status,'oracle_fingerprint':expected_oracle_fp,'policy_fingerprint':expected_policy_fp,'blockers':sorted(set(blockers)),'warnings':sorted(set(warnings)),'claims_evaluated':len(claims),'mutation':mutation}
pathlib.Path(a.output).write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps(result,indent=2,ensure_ascii=False))
raise SystemExit(0 if status=='verified' else 1)

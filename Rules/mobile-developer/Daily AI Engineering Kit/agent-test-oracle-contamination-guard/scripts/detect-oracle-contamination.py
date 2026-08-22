#!/usr/bin/env python3
import argparse, hashlib, json, pathlib, sys

def load(path):
    try: return json.loads(pathlib.Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'invalid-json:{path}:{exc}',file=sys.stderr); raise SystemExit(2)

def canon(v): return json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def fp(v): return hashlib.sha256(canon(v).encode()).hexdigest()
def norm(v):
    if isinstance(v,(dict,list)): return canon(v)
    if v is None: return 'null'
    if isinstance(v,bool): return str(v).lower()
    return str(v)

p=argparse.ArgumentParser()
p.add_argument('--claims',required=True)
p.add_argument('--assertions',required=True)
p.add_argument('--policy',required=True)
p.add_argument('--output',required=True)
a=p.parse_args()
claims=load(a.claims); inv=load(a.assertions); policy=load(a.policy)
if not isinstance(claims,list) or not isinstance(inv,dict) or not isinstance(inv.get('assertions'),list):
    print('invalid-input-contract',file=sys.stderr); raise SystemExit(2)
independent=set(policy.get('independent_sources',[])); implementation=set(policy.get('implementation_sources',[]))
blockers=[]; warnings=[]; findings=[]
all_assertions=inv['assertions']
for claim in claims:
    cid=claim.get('id','<missing>'); st=claim.get('source_type'); is_ind=bool(claim.get('independent'))
    expected=norm(claim.get('expected'))
    if st in implementation or not is_ind:
        blockers.append(f'{cid}:oracle-not-independent:{st}')
    if is_ind and st not in independent:
        warnings.append(f'{cid}:unrecognized-independent-source:{st}')
    if st=='private-helper': blockers.append(f'{cid}:private-helper-as-oracle')
    if st=='current-branch-behavior': blockers.append(f'{cid}:current-output-as-oracle')
    mirrored=[]
    for ass in all_assertions:
        literal_text=' '.join(ass.get('literals',[]))
        if expected and expected in literal_text:
            mirrored.append(f"{ass.get('file')}:{ass.get('line')}")
        overlap=set(claim.get('implementation_symbols',[])) & set(ass.get('identifiers',[]))
        if overlap:
            warnings.append(f"{cid}:shared-implementation-symbols:{','.join(sorted(overlap))}:{ass.get('file')}:{ass.get('line')}")
    if mirrored and not is_ind:
        blockers.append(f"{cid}:literal-mirroring-without-independent-source:{','.join(mirrored)}")
    findings.append({'claim_id':cid,'mirrored_assertions':mirrored})
result={
  'version':'1.0.0',
  'oracle_fingerprint':fp({'claims':claims,'policy':policy}),
  'policy_fingerprint':fp(policy),
  'blockers':sorted(set(blockers)),
  'warnings':sorted(set(warnings)),
  'findings':findings,
  'claims_evaluated':len(claims)
}
pathlib.Path(a.output).write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps({'blockers':len(result['blockers']),'warnings':len(result['warnings']),'output':a.output}))
raise SystemExit(1 if result['blockers'] else 0)

#!/usr/bin/env python3
import argparse, fnmatch, json, re, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    print(json.dumps({'status':'error','error':'PyYAML is required: pip install pyyaml'})); sys.exit(3)

def flatten(obj,prefix=''):
    out={}
    if isinstance(obj,dict):
        for k,v in obj.items():
            key=f'{prefix}.{k}' if prefix else str(k)
            out.update(flatten(v,key))
    else: out[prefix]=obj
    return out

def load_data(path):
    p=Path(path); text=p.read_text(encoding='utf-8')
    if p.suffix.lower() in ('.yaml','.yml'): return yaml.safe_load(text) or {}
    return json.loads(text)

def matches_any(key,patterns):
    return any(fnmatch.fnmatchcase(key.lower(),p.lower()) for p in patterns)

def redacted(key,value,policy):
    lk=key.lower()
    if any(p.lower() in lk for p in policy.get('sensitive_key_patterns',[])):
        return '<redacted>'
    return value

def main():
    ap=argparse.ArgumentParser(description='Compare approved baseline configuration with a target snapshot. Never modifies configuration.')
    ap.add_argument('--baseline',required=True); ap.add_argument('--current',required=True); ap.add_argument('--policy',required=True)
    ap.add_argument('--environment',required=True); ap.add_argument('--output')
    a=ap.parse_args()
    try:
        baseline=flatten(load_data(a.baseline)); current=flatten(load_data(a.current)); policy=load_data(a.policy)
    except Exception as e:
        print(json.dumps({'status':'error','error':str(e)})); return 3
    ignore=policy.get('ignore_keys',[])
    baseline={k:v for k,v in baseline.items() if not matches_any(k,ignore)}
    current={k:v for k,v in current.items() if not matches_any(k,ignore)}
    added=sorted(set(current)-set(baseline)); removed=sorted(set(baseline)-set(current)); common=sorted(set(baseline)&set(current))
    changed=[k for k in common if baseline[k]!=current[k]]
    findings=[]; approvals=[]
    prod=a.environment.lower() in [x.lower() for x in policy.get('production_environment_names',['production','prod','live'])]
    protected=policy.get('protected_keys',[]); approval_patterns=policy.get('approval_required_keys',[])
    for k in changed+added+removed:
        old=baseline.get(k,'<missing>'); new=current.get(k,'<missing>')
        if prod and policy.get('block_protected_key_changes_in_production',True) and matches_any(k,protected):
            findings.append({'code':'PROTECTED_PRODUCTION_DRIFT','severity':'block','key':k,'old':redacted(k,old,policy),'new':redacted(k,new,policy)})
        if matches_any(k,approval_patterns):
            approvals.append({'code':'CHANGE_REQUIRES_APPROVAL','key':k,'old':redacted(k,old,policy),'new':redacted(k,new,policy)})
        for rule in policy.get('blocked_change_patterns',[]):
            if re.fullmatch(rule.get('key_regex','.*'),k) and re.fullmatch(rule.get('new_value_regex','.*'),str(new)):
                findings.append({'code':'BLOCKED_SECURITY_WEAKENING','severity':'block','key':k,'old':redacted(k,old,policy),'new':redacted(k,new,policy)})
    if len(changed)>int(policy.get('max_changed_keys',25)): findings.append({'code':'TOO_MANY_CHANGED_KEYS','severity':'block','count':len(changed)})
    if len(added)>int(policy.get('max_added_keys',10)): findings.append({'code':'TOO_MANY_ADDED_KEYS','severity':'block','count':len(added)})
    if len(removed)>int(policy.get('max_removed_keys',10)): findings.append({'code':'TOO_MANY_REMOVED_KEYS','severity':'block','count':len(removed)})
    if findings: status='blocked'
    elif approvals: status='approval_required'
    else: status='passed'
    result={'status':status,'environment':a.environment,'counts':{'changed':len(changed),'added':len(added),'removed':len(removed)},'changed':[{'key':k,'old':redacted(k,baseline[k],policy),'new':redacted(k,current[k],policy)} for k in changed],'added':[{'key':k,'new':redacted(k,current[k],policy)} for k in added],'removed':[{'key':k,'old':redacted(k,baseline[k],policy)} for k in removed],'findings':findings,'approvals':approvals,'modified':False}
    text=json.dumps(result,indent=2,ensure_ascii=False)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    print(text)
    return 2 if status=='blocked' else 4 if status=='approval_required' else 0
if __name__=='__main__': sys.exit(main())

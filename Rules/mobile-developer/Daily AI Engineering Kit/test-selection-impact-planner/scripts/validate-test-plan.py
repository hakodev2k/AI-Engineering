#!/usr/bin/env python3
import argparse,json,sys

def load(p):
    with open(p,encoding='utf-8') as f:return json.load(f)
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--plan',required=True);ap.add_argument('--policy',required=True);a=ap.parse_args()
    try:
        plan,policy=load(a.plan),load(a.policy); errors=[]
        req=['version','plan_revision','base_ref','change_fingerprint','changed_paths','risk_triggers','impacted_components','selected_tests','mandatory_suites','fallback_mode','confidence','unresolved_impact']
        for k in req:
            if k not in plan: errors.append('missing:'+k)
        if len(str(plan.get('change_fingerprint','')))!=64: errors.append('invalid-change-fingerprint')
        for x in plan.get('changed_paths',[]):
            if not x.get('path') or not x.get('classes'): errors.append('unclassified-change')
        mandatory=set(plan.get('mandatory_suites',[])); expected=set()
        for r in plan.get('risk_triggers',[]): expected.update(policy.get('mandatory_suites',{}).get(r,[]))
        missing=sorted(expected-mandatory)
        if missing: errors.append('missing-mandatory:'+','.join(missing))
        conf=float(plan.get('confidence',0)); mode=plan.get('fallback_mode')
        if plan.get('unresolved_impact') and mode!='full': errors.append('unknown-impact-requires-full')
        if mode=='targeted' and conf<float(policy.get('minimum_confidence_for_targeted',0.8)): errors.append('targeted-confidence-too-low')
        if mode=='module' and conf<float(policy.get('minimum_confidence_for_module',0.6)): errors.append('module-confidence-too-low')
        selected_suites={x.get('suite') for x in plan.get('selected_tests',[])}
        for s in mandatory:
            if s not in selected_suites and s!='full': errors.append('mandatory-suite-not-selected:'+s)
        status='valid' if not errors else 'invalid'; print(json.dumps({'status':status,'errors':errors},indent=2)); return 0 if not errors else 20
    except Exception as e:
        print(json.dumps({'status':'error','error':str(e)})); return 20
if __name__=='__main__': sys.exit(main())
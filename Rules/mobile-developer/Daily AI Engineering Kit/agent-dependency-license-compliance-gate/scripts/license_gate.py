#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    print(json.dumps({'status':'error','error':'PyYAML is required: pip install pyyaml'}))
    sys.exit(3)

VALID_POLICIES={'allow','approval_required','block'}

def normalize_license(value):
    if isinstance(value,str): return value.strip()
    if isinstance(value,dict):
        lic=value.get('license') if 'license' in value else value
        if isinstance(lic,dict):
            return str(lic.get('id') or lic.get('name') or '').strip()
        if isinstance(lic,str): return lic.strip()
    return ''

def component_licenses(component):
    out=[]
    for item in component.get('licenses') or []:
        value=normalize_license(item)
        if value: out.append(value)
    return out

def package_id(component):
    return component.get('purl') or component.get('bom-ref') or component.get('name') or '<unnamed>'

def policy_for(license_id, policy):
    if license_id in set(policy.get('block',[])): return 'block'
    if license_id in set(policy.get('approval_required',[])): return 'approval_required'
    if license_id in set(policy.get('allow',[])): return 'allow'
    return policy.get('unknown_license','approval_required')

def exception_for(component, policy):
    pid=package_id(component); version=str(component.get('version') or '')
    for ex in policy.get('package_exceptions',[]):
        if ex.get('package')==pid and (not ex.get('version') or str(ex.get('version'))==version):
            decision=ex.get('decision')
            if decision in VALID_POLICIES: return decision, ex.get('reason','configured exception')
    return None,None

def evaluate_component(component, policy):
    findings=[]; approvals=[]
    pid=package_id(component); version=str(component.get('version') or '')
    if policy.get('require_component_version',True) and not version:
        findings.append({'code':'MISSING_VERSION','package':pid,'severity':'block'})
    if policy.get('require_purl_or_bom_ref',True) and not (component.get('purl') or component.get('bom-ref')):
        findings.append({'code':'MISSING_STABLE_ID','package':pid,'severity':'block'})
    licenses=component_licenses(component)
    ex_decision,ex_reason=exception_for(component,policy)
    if ex_decision:
        item={'code':'PACKAGE_EXCEPTION','package':pid,'version':version,'decision':ex_decision,'reason':ex_reason}
        if ex_decision=='block': findings.append({**item,'severity':'block'})
        elif ex_decision=='approval_required': approvals.append(item)
        return findings,approvals
    if not licenses:
        missing=policy.get('missing_license','block')
        item={'code':'MISSING_LICENSE','package':pid,'version':version,'decision':missing}
        if missing=='block': findings.append({**item,'severity':'block'})
        elif missing=='approval_required': approvals.append(item)
        return findings,approvals
    decisions=[policy_for(x,policy) for x in licenses]
    strategy=policy.get('multiple_license_strategy','any_allowed')
    if strategy=='all_allowed':
        decision='allow' if all(x=='allow' for x in decisions) else ('block' if 'block' in decisions else 'approval_required')
    else:
        decision='allow' if 'allow' in decisions else ('block' if 'block' in decisions else 'approval_required')
    if decision=='block': findings.append({'code':'LICENSE_BLOCKED','package':pid,'version':version,'licenses':licenses,'severity':'block'})
    elif decision=='approval_required': approvals.append({'code':'LICENSE_APPROVAL_REQUIRED','package':pid,'version':version,'licenses':licenses})
    return findings,approvals

def main():
    ap=argparse.ArgumentParser(description='Evaluate CycloneDX JSON dependency licenses against policy. Never installs or changes dependencies.')
    ap.add_argument('--sbom',required=True); ap.add_argument('--policy',required=True); ap.add_argument('--output')
    args=ap.parse_args()
    try:
        sbom=json.loads(Path(args.sbom).read_text(encoding='utf-8'))
        policy=yaml.safe_load(Path(args.policy).read_text(encoding='utf-8')) or {}
    except Exception as e:
        print(json.dumps({'status':'error','error':str(e)})); return 3
    if not isinstance(sbom,dict) or not isinstance(sbom.get('components',[]),list):
        print(json.dumps({'status':'error','error':'SBOM must be CycloneDX-like JSON with components[]'})); return 3
    findings=[]; approvals=[]
    for component in sbom.get('components',[]):
        if not isinstance(component,dict):
            findings.append({'code':'INVALID_COMPONENT','package':'<invalid>','severity':'block'}); continue
        f,a=evaluate_component(component,policy); findings.extend(f); approvals.extend(a)
    status='blocked' if findings else ('approval_required' if approvals else 'passed')
    result={'status':status,'component_count':len(sbom.get('components',[])),'findings':findings,'approvals':approvals,'changed_dependencies':False}
    text=json.dumps(result,indent=2,sort_keys=True)
    if args.output: Path(args.output).write_text(text+'\n',encoding='utf-8')
    print(text)
    return 2 if status=='blocked' else 4 if status=='approval_required' else 0

if __name__=='__main__': sys.exit(main())

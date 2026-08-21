#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

MISSING = object()

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as e:
        print(f'ERROR: cannot read {path}: {e}', file=sys.stderr)
        sys.exit(2)

def schema_type(node):
    if isinstance(node, dict):
        return node.get('type')
    return None

def compare(old, new, path='$'):
    findings = []
    if not isinstance(old, dict) or not isinstance(new, dict):
        if old != new:
            findings.append({'change':'replace-schema-node','path':path,'severity':'breaking','evidence':'schema node changed incompatibly','recommendation':'version the message or preserve the old representation'})
        return findings

    old_type, new_type = schema_type(old), schema_type(new)
    if old_type and new_type and old_type != new_type:
        findings.append({'change':'change-type','path':path,'severity':'breaking','evidence':f'type changed from {old_type} to {new_type}','recommendation':'keep the old type or introduce a new versioned field/message'})

    old_props = old.get('properties', {}) if isinstance(old.get('properties', {}), dict) else {}
    new_props = new.get('properties', {}) if isinstance(new.get('properties', {}), dict) else {}
    old_required = set(old.get('required', []))
    new_required = set(new.get('required', []))

    for name in sorted(old_props.keys() - new_props.keys()):
        findings.append({'change':'remove-field','path':f'{path}.{name}','severity':'breaking','evidence':'field exists in old schema but not new schema','recommendation':'retain the field through the compatibility window or version the message'})
    for name in sorted(new_props.keys() - old_props.keys()):
        severity = 'breaking' if name in new_required else 'info'
        findings.append({'change':'add-required-field' if severity == 'breaking' else 'add-optional-field','path':f'{path}.{name}','severity':severity,'evidence':'field added in new schema','recommendation':'make the field optional/defaulted' if severity == 'breaking' else 'verify old consumers ignore unknown fields'})
    for name in sorted(old_props.keys() & new_props.keys()):
        findings.extend(compare(old_props[name], new_props[name], f'{path}.{name}'))
        if name not in old_required and name in new_required:
            findings.append({'change':'make-optional-field-required','path':f'{path}.{name}','severity':'breaking','evidence':'optional field became required','recommendation':'keep optional until all historical messages and producers provide it'})

    old_enum, new_enum = old.get('enum'), new.get('enum')
    if isinstance(old_enum, list) and isinstance(new_enum, list):
        removed = [x for x in old_enum if x not in new_enum]
        added = [x for x in new_enum if x not in old_enum]
        if removed:
            findings.append({'change':'remove-enum-value','path':path,'severity':'breaking','evidence':f'removed enum values: {removed}','recommendation':'preserve values or version the contract'})
        if added:
            findings.append({'change':'add-enum-value','path':path,'severity':'warning','evidence':f'added enum values: {added}','recommendation':'prove all consumers tolerate unknown enum values'})
    return findings

def main():
    p = argparse.ArgumentParser(description='Compare two JSON Schema message contracts for backward-compatibility risks.')
    p.add_argument('--old', required=True)
    p.add_argument('--new', required=True)
    p.add_argument('--message', required=True)
    p.add_argument('--producer', required=True)
    p.add_argument('--consumer', action='append', required=True)
    p.add_argument('--output', default='compatibility-report.json')
    a = p.parse_args()
    findings = compare(load(a.old), load(a.new))
    breaking = any(f['severity'] == 'breaking' for f in findings)
    report = {
        'status': 'incompatible' if breaking else 'compatible',
        'message': a.message,
        'producer': a.producer,
        'consumers': a.consumer,
        'findings': findings,
        'rollout_order': ['deploy tolerant consumers', 'deploy compatible producer', 'observe', 'retire legacy representation after compatibility window'],
        'replay_safe': not breaking,
        'verification': 'not-run',
        'errors': []
    }
    Path(a.output).write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(f"{report['status']}: {len(findings)} finding(s); report={a.output}")
    return 1 if breaking else 0

if __name__ == '__main__':
    sys.exit(main())

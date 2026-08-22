#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def norm(value):
    if isinstance(value, str):
        return [value]
    if isinstance(value, list) and all(isinstance(x, str) for x in value):
        return value
    raise ValueError('actions/resources/principals must be a string or list of strings')


def covers(broad, narrow):
    b = set(norm(broad)); n = set(norm(narrow))
    return '*' in b or n.issubset(b)


def validate_rule(rule):
    required = ['id', 'priority', 'effect', 'actions', 'resources']
    missing = [x for x in required if x not in rule]
    if missing:
        raise ValueError(f"rule missing {','.join(missing)}")
    if rule['effect'] not in ('allow', 'deny'):
        raise ValueError(f"invalid effect for {rule['id']}")
    if not isinstance(rule['priority'], int):
        raise ValueError(f"priority must be integer for {rule['id']}")
    norm(rule['actions']); norm(rule['resources']); norm(rule.get('principals', ['*']))


def analyze(doc):
    rules = doc.get('policies')
    if not isinstance(rules, list):
        raise ValueError('input must contain policies array')
    for r in rules: validate_rule(r)
    ordered = sorted(rules, key=lambda r: (r['priority'], r['id']))
    findings = []
    for i, later in enumerate(ordered):
        for earlier in ordered[:i]:
            if not covers(earlier.get('principals', ['*']), later.get('principals', ['*'])):
                continue
            if not covers(earlier['actions'], later['actions']):
                continue
            if not covers(earlier['resources'], later['resources']):
                continue
            if earlier['effect'] == later['effect']:
                kind = 'redundant-shadow'
                severity = 'medium'
            else:
                kind = f"shadowed-{later['effect']}"
                severity = 'high'
            findings.append({
                'type': kind,
                'severity': severity,
                'shadowing_rule': earlier['id'],
                'shadowed_rule': later['id'],
                'evidence': {
                    'shadowing_priority': earlier['priority'],
                    'shadowed_priority': later['priority'],
                    'actions': later['actions'],
                    'resources': later['resources'],
                    'principals': later.get('principals', ['*'])
                },
                'recommendation': 'narrow the earlier rule, reorder priorities, or remove the unreachable rule after human review'
            })
            break
    blocking = [f for f in findings if f['type'] in ('shadowed-allow','shadowed-deny')]
    return {'status': 'blocked' if blocking else 'pass', 'finding_count': len(findings), 'blocking_count': len(blocking), 'findings': findings}


def main():
    p = argparse.ArgumentParser(description='Detect unreachable authorization rules under first-match evaluation.')
    p.add_argument('input', type=Path)
    p.add_argument('--output', type=Path)
    args = p.parse_args()
    try:
        doc = json.loads(args.input.read_text(encoding='utf-8'))
        result = analyze(doc)
    except (OSError, json.JSONDecodeError, ValueError) as e:
        print(json.dumps({'status':'error','error':str(e)}), file=sys.stderr)
        return 2
    text = json.dumps(result, indent=2)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text + '\n', encoding='utf-8')
    else:
        print(text)
    return 1 if result['status'] == 'blocked' else 0

if __name__ == '__main__':
    raise SystemExit(main())

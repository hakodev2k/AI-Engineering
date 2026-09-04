#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

SAFE_SCALARS = (str, int, float, bool, type(None))

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        raise ValueError(f'cannot load {path}: {exc}')

def inspect_node(node, policy, path='$', depth=0, findings=None):
    findings = findings if findings is not None else []
    if depth > int(policy.get('max_depth', 32)):
        findings.append({'path': path, 'reason': 'max_depth_exceeded'})
        return findings
    if isinstance(node, SAFE_SCALARS):
        return findings
    if isinstance(node, list):
        for i, value in enumerate(node):
            inspect_node(value, policy, f'{path}[{i}]', depth + 1, findings)
        return findings
    if isinstance(node, dict):
        marker = node.get('__host_type__')
        forbidden = set(policy.get('forbidden_type_markers', []))
        if isinstance(marker, str) and marker.lower() in forbidden:
            findings.append({'path': path, 'reason': 'forbidden_host_type', 'marker': marker})
        for key, value in node.items():
            key_text = str(key).lower()
            if key_text in {'__proto__', 'prototype', 'constructor'}:
                findings.append({'path': f'{path}.{key}', 'reason': 'prototype_or_constructor_surface'})
            inspect_node(value, policy, f'{path}.{key}', depth + 1, findings)
        return findings
    findings.append({'path': path, 'reason': 'non_json_value'})
    return findings

def main():
    parser = argparse.ArgumentParser(description='Validate normalized sandbox-boundary observations.')
    parser.add_argument('observation', help='JSON observation of values crossing into the sandbox')
    parser.add_argument('--policy', required=True)
    args = parser.parse_args()
    try:
        policy = load(args.policy)
        observation = load(args.observation)
        if policy.get('mode') != 'fail_closed':
            raise ValueError('policy mode must be fail_closed')
        findings = inspect_node(observation, policy)
        out = {'status': 'blocked' if findings else 'pass', 'findings': findings}
        print(json.dumps(out, indent=2, sort_keys=True))
        return 2 if findings else 0
    except Exception as exc:
        print(json.dumps({'status': 'error', 'error': str(exc)}))
        return 3

if __name__ == '__main__':
    sys.exit(main())

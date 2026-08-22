#!/usr/bin/env python3
"""Validate a required provider capability set against a declared/probed capability matrix."""
import argparse, json, pathlib, sys

def load(path):
    try:
        return json.loads(pathlib.Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'error reading {path}: {exc}', file=sys.stderr); raise SystemExit(2)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--required', required=True, help='JSON array of required capability names')
    ap.add_argument('--matrix', required=True, help='JSON object capability -> supported bool/evidence object')
    args = ap.parse_args()
    required, matrix = load(args.required), load(args.matrix)
    if not isinstance(required, list) or not all(isinstance(x, str) and x for x in required):
        print('required must be a non-empty-string JSON array', file=sys.stderr); return 2
    if not isinstance(matrix, dict):
        print('matrix must be a JSON object', file=sys.stderr); return 2
    missing, unknown = [], []
    for cap in required:
        value = matrix.get(cap, None)
        supported = value if isinstance(value, bool) else value.get('supported') if isinstance(value, dict) else None
        if supported is False: missing.append(cap)
        elif supported is not True: unknown.append(cap)
    result = {'required': required, 'unsupported': missing, 'unknown': unknown, 'pass': not missing and not unknown}
    print(json.dumps(result, indent=2))
    return 0 if result['pass'] else 3

if __name__ == '__main__':
    raise SystemExit(main())

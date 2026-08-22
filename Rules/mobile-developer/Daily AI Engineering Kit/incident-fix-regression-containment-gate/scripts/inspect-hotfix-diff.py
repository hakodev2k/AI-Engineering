#!/usr/bin/env python3
import argparse, fnmatch, json, sys


def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def matches(path, patterns):
    return any(fnmatch.fnmatch(path, p) or path == p or path.startswith(p.rstrip('/') + '/') for p in patterns)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--plan', required=True)
    p.add_argument('--changed-files', required=True)
    p.add_argument('--output', required=True)
    args = p.parse_args()
    try:
        plan = load(args.plan)
        with open(args.changed_files, 'r', encoding='utf-8') as f:
            changed = sorted({line.strip().replace('\\','/') for line in f if line.strip()})
    except Exception as e:
        print(f'input-error: {e}', file=sys.stderr); return 2

    allowed = plan.get('allowed_paths', [])
    forbidden = plan.get('forbidden_paths', [])
    unexpected = [x for x in changed if not matches(x, allowed)]
    forbidden_hits = [x for x in changed if matches(x, forbidden)]
    report = {
        'incident_id': plan.get('incident_id'),
        'changed_files': changed,
        'unexpected_files': unexpected,
        'forbidden_files': forbidden_hits,
        'contained': not unexpected and not forbidden_hits
    }
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    print(json.dumps(report, indent=2))
    return 0 if report['contained'] else 4

if __name__ == '__main__':
    raise SystemExit(main())
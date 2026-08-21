#!/usr/bin/env python3
import argparse
import json
import os
import sys
from collections import Counter

NOISE_SEGMENTS = {
    '.venv': 'dependency', 'venv': 'dependency', 'node_modules': 'dependency',
    '__pycache__': 'cache', '.cache': 'cache', 'dist': 'generated', 'build': 'generated',
}
GIT_INTERNAL = {'.git/objects', '.git/logs', '.git/modules', '.git/refs/codex/turn-diffs'}


def classify(path: str) -> str:
    norm = path.replace('\\', '/').rstrip('/')
    low = norm.lower()
    for marker in GIT_INTERNAL:
        if f'/{marker}' in low or low.endswith(marker):
            return 'git-internal'
    parts = [p.lower() for p in norm.split('/') if p]
    for part in parts:
        if part in NOISE_SEGMENTS:
            return NOISE_SEGMENTS[part]
    return 'project-or-unknown'


def main() -> int:
    parser = argparse.ArgumentParser(description='Profile watched-path pressure against an OS watch budget.')
    parser.add_argument('--paths', required=True, help='UTF-8 file containing one watched path per line')
    parser.add_argument('--limit', required=True, type=int, help='OS/user watcher limit')
    parser.add_argument('--warn', type=float, default=0.60)
    parser.add_argument('--block', type=float, default=0.80)
    args = parser.parse_args()

    if args.limit <= 0 or not (0 <= args.warn < args.block <= 1):
        print('invalid limit/thresholds', file=sys.stderr)
        return 2
    if not os.path.isfile(args.paths):
        print(f'paths file not found: {args.paths}', file=sys.stderr)
        return 2

    try:
        with open(args.paths, 'r', encoding='utf-8') as fh:
            paths = [line.strip() for line in fh if line.strip()]
    except OSError as exc:
        print(f'cannot read paths: {exc}', file=sys.stderr)
        return 2

    count = len(paths)
    utilization = count / args.limit
    categories = Counter(classify(p) for p in paths)
    noisy = categories['dependency'] + categories['cache'] + categories['generated'] + categories['git-internal']

    if utilization >= args.block:
        verdict = 'block-new'
        exit_code = 3
    elif utilization >= args.warn:
        verdict = 'warn'
        exit_code = 1
    else:
        verdict = 'safe'
        exit_code = 0

    result = {
        'watch_count': count,
        'limit': args.limit,
        'utilization': round(utilization, 6),
        'verdict': verdict,
        'categories': dict(categories),
        'high_noise_count': noisy,
        'high_noise_fraction': round(noisy / count, 6) if count else 0.0,
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return exit_code


if __name__ == '__main__':
    sys.exit(main())

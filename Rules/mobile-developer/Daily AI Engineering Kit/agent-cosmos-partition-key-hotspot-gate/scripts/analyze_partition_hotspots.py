#!/usr/bin/env python3
import argparse, csv, json, sys
from collections import defaultdict
from pathlib import Path


def load_policy(path):
    text = Path(path).read_text(encoding='utf-8')
    values = {}
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or ':' not in line or line.startswith('- '):
            continue
        key, value = line.split(':', 1)
        value = value.strip()
        if value.lower() in ('true','false'):
            values[key] = value.lower() == 'true'
        else:
            try:
                values[key] = float(value) if '.' in value else int(value)
            except ValueError:
                values[key] = value
    return values


def read_rows(path):
    with open(path, newline='', encoding='utf-8') as f:
        r = csv.DictReader(f)
        required = {'partition_key','request_units'}
        if not required.issubset(r.fieldnames or []):
            raise ValueError('CSV must contain partition_key,request_units')
        rows = []
        for i, row in enumerate(r, 2):
            key = (row.get('partition_key') or '').strip()
            if not key:
                raise ValueError(f'row {i}: partition_key is empty')
            try:
                ru = float(row['request_units'])
            except Exception:
                raise ValueError(f'row {i}: invalid request_units')
            if ru < 0:
                raise ValueError(f'row {i}: request_units must be >= 0')
            rows.append((key, ru))
        return rows


def analyze(rows, policy):
    counts, rus = defaultdict(int), defaultdict(float)
    total_ru = 0.0
    for key, ru in rows:
        counts[key] += 1
        rus[key] += ru
        total_ru += ru
    total_count = len(rows)
    min_samples = int(policy.get('minimum_sample_count', 100))
    count_t = float(policy.get('hot_partition_share_threshold', .20))
    ru_t = float(policy.get('hot_partition_ru_threshold', .30))
    findings = []
    for key in sorted(counts):
        count_share = counts[key] / total_count if total_count else 0
        ru_share = rus[key] / total_ru if total_ru else 0
        hot = total_count >= min_samples and (count_share >= count_t or ru_share >= ru_t)
        findings.append({
            'partition_key': key,
            'request_count': counts[key],
            'request_units': round(rus[key], 4),
            'request_share': round(count_share, 6),
            'ru_share': round(ru_share, 6),
            'hot': hot,
            'evidence': f'count_share={count_share:.2%}; ru_share={ru_share:.2%}'
        })
    hot = [x for x in findings if x['hot']]
    status = 'block' if hot else ('warn' if total_count < min_samples else 'pass')
    return {
        'status': status,
        'sample_count': total_count,
        'total_request_units': round(total_ru, 4),
        'hot_partition_count': len(hot),
        'findings': findings,
        'verification_status': 'verified' if total_count >= min_samples else 'insufficient-sample'
    }


def main():
    p = argparse.ArgumentParser(description='Detect Cosmos DB logical partition hotspots from RU samples.')
    p.add_argument('--input', required=True, help='CSV with partition_key,request_units')
    p.add_argument('--policy', default='config/policy.yaml')
    p.add_argument('--output', default='hotspot-report.json')
    args = p.parse_args()
    try:
        policy = load_policy(args.policy)
        rows = read_rows(args.input)
        result = analyze(rows, policy)
        Path(args.output).write_text(json.dumps(result, indent=2), encoding='utf-8')
        print(json.dumps({'status': result['status'], 'output': args.output}))
        return 2 if result['status'] == 'block' else 0
    except Exception as exc:
        print(f'error: {exc}', file=sys.stderr)
        return 3


if __name__ == '__main__':
    raise SystemExit(main())

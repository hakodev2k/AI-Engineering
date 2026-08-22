#!/usr/bin/env python3
"""Profile JSON/JSONL agent payloads for byte size, estimated tokens, and duplicates."""
import argparse, hashlib, json, pathlib, sys

def estimate_tokens(text: str) -> int:
    # Conservative dependency-free estimate; replace with provider tokenizer when available.
    return (len(text.encode('utf-8')) + 2) // 3

def canonical_bytes(value) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument('input', help='JSON file containing a list of tool-result objects')
    p.add_argument('--soft-bytes', type=int, default=500_000)
    p.add_argument('--hard-bytes', type=int, default=20_000_000)
    args = p.parse_args()
    if args.soft_bytes <= 0 or args.hard_bytes <= args.soft_bytes:
        print('invalid thresholds', file=sys.stderr); return 2
    path = pathlib.Path(args.input)
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'cannot read JSON: {exc}', file=sys.stderr); return 2
    if not isinstance(data, list):
        print('input must be a JSON array', file=sys.stderr); return 2
    seen, items, duplicate_bytes = {}, [], 0
    total = 0
    for i, value in enumerate(data):
        raw = canonical_bytes(value); size = len(raw); total += size
        digest = hashlib.sha256(raw).hexdigest()
        duplicate = digest in seen
        if duplicate: duplicate_bytes += size
        else: seen[digest] = i
        items.append({'index': i, 'bytes': size, 'estimated_tokens': estimate_tokens(raw.decode('utf-8')), 'sha256': digest, 'duplicate_of': seen[digest] if duplicate else None, 'above_soft_limit': size >= args.soft_bytes})
    result = {'total_bytes': total, 'estimated_tokens': estimate_tokens(canonical_bytes(data).decode('utf-8')), 'duplicate_bytes': duplicate_bytes, 'hard_utilization': round(total / args.hard_bytes, 4), 'dispatch_blocked': total >= int(args.hard_bytes * .90), 'items': sorted(items, key=lambda x: x['bytes'], reverse=True)}
    print(json.dumps(result, indent=2))
    return 3 if result['dispatch_blocked'] else 0

if __name__ == '__main__':
    raise SystemExit(main())

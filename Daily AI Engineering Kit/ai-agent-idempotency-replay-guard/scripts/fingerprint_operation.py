#!/usr/bin/env python3
import argparse, hashlib, json
from pathlib import Path


def canonical(obj, volatile):
    if isinstance(obj, dict):
        return {k: canonical(v, volatile) for k, v in sorted(obj.items()) if k not in volatile}
    if isinstance(obj, list):
        return [canonical(v, volatile) for v in obj]
    return obj


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--payload', required=True)
    p.add_argument('--policy')
    args = p.parse_args()
    payload = json.loads(Path(args.payload).read_text(encoding='utf-8'))
    volatile = set()
    if args.policy:
        policy = json.loads(Path(args.policy).read_text(encoding='utf-8'))
        volatile = set(policy.get('volatile_payload_fields', []))
    data = json.dumps(canonical(payload, volatile), sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()
    print(hashlib.sha256(data).hexdigest())

if __name__ == '__main__':
    main()

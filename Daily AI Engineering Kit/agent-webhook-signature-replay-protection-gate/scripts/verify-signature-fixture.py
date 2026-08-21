#!/usr/bin/env python3
import argparse, hashlib, hmac, json, pathlib, sys, time

def sign(secret: bytes, timestamp: int, body: bytes) -> str:
    payload = str(timestamp).encode() + b'.' + body
    return hmac.new(secret, payload, hashlib.sha256).hexdigest()

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--secret', required=True)
    p.add_argument('--body-file', required=True)
    p.add_argument('--timestamp', type=int)
    p.add_argument('--signature')
    p.add_argument('--max-skew', type=int, default=300)
    a=p.parse_args()
    body=pathlib.Path(a.body_file).read_bytes()
    ts=a.timestamp if a.timestamp is not None else int(time.time())
    expected=sign(a.secret.encode(), ts, body)
    if a.signature is None:
        print(json.dumps({'timestamp':ts,'signature':expected}, indent=2)); return 0
    if abs(int(time.time())-ts) > a.max_skew:
        print('timestamp outside allowed skew', file=sys.stderr); return 1
    if not hmac.compare_digest(expected, a.signature):
        print('signature mismatch', file=sys.stderr); return 1
    print('signature valid'); return 0
if __name__=='__main__': raise SystemExit(main())

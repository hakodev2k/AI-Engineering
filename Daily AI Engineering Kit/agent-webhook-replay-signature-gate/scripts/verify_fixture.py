#!/usr/bin/env python3
import argparse, hashlib, hmac, pathlib, sys

def main():
    p=argparse.ArgumentParser(description='Generate/verify HMAC-SHA256 timestamp.raw-body webhook fixtures; use only when this matches provider contract.')
    p.add_argument('--secret', required=True)
    p.add_argument('--body', required=True)
    p.add_argument('--timestamp', required=True, type=int)
    p.add_argument('--signature')
    a=p.parse_args()
    if not a.secret: return 2
    path=pathlib.Path(a.body)
    if not path.is_file():
        print('body file not found', file=sys.stderr); return 2
    body=path.read_bytes()
    msg=str(a.timestamp).encode('ascii')+b'.'+body
    digest=hmac.new(a.secret.encode('utf-8'),msg,hashlib.sha256).hexdigest()
    if a.signature is None:
        print(digest); return 0
    try:
        ok=hmac.compare_digest(bytes.fromhex(digest),bytes.fromhex(a.signature.strip()))
    except ValueError:
        print('signature must be hexadecimal', file=sys.stderr); return 2
    print('valid' if ok else 'invalid')
    return 0 if ok else 1

if __name__=='__main__': raise SystemExit(main())

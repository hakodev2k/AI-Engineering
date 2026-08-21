#!/usr/bin/env python3
"""Validate or quarantine rebuildable sandbox state without weakening policy.

Exit codes: 0 valid/action completed; 2 invalid/incompatible state; 3 usage/environment error.
"""
from __future__ import annotations
import argparse, hashlib, json, os, sys, time
from pathlib import Path


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_json(path: Path):
    data = path.read_bytes()
    return data, json.loads(data.decode("utf-8"))


def inspect(args) -> int:
    p = Path(args.path).expanduser()
    if not p.is_file():
        print(json.dumps({"status":"invalid","reason":"missing","path":str(p)}))
        return 2
    try:
        data, obj = load_json(p)
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as e:
        print(json.dumps({"status":"invalid","reason":"unparseable","path":str(p),"error":str(e)}))
        return 2
    if not isinstance(obj, dict):
        print(json.dumps({"status":"invalid","reason":"root-not-object","path":str(p)}))
        return 2
    sha = digest(data)
    if args.expected_sha256 and sha.lower() != args.expected_sha256.lower():
        print(json.dumps({"status":"invalid","reason":"sha256-mismatch","sha256":sha}))
        return 2
    if args.schema_version is not None:
        actual = obj.get("schema_version", obj.get("version"))
        if actual is not None and str(actual) != str(args.schema_version):
            print(json.dumps({"status":"incompatible","reason":"schema-version","expected":str(args.schema_version),"actual":str(actual),"sha256":sha}))
            return 2
    if args.runtime_owner:
        actual_owner = obj.get("runtime_owner")
        if actual_owner is not None and str(actual_owner) != args.runtime_owner:
            print(json.dumps({"status":"incompatible","reason":"runtime-owner","expected":args.runtime_owner,"actual":str(actual_owner),"sha256":sha}))
            return 2
    print(json.dumps({"status":"valid","classification":args.classification,"path":str(p),"bytes":len(data),"sha256":sha}))
    return 0


def quarantine(args) -> int:
    if args.classification != "rebuildable-cache":
        print(json.dumps({"status":"blocked","reason":"only-rebuildable-cache-can-be-quarantined"}))
        return 3
    p = Path(args.path).expanduser()
    if not p.is_file():
        print(json.dumps({"status":"blocked","reason":"missing","path":str(p)}))
        return 3
    data = p.read_bytes()
    sha = digest(data)
    stamp = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
    q = p.with_name(f"{p.name}.quarantine-{stamp}-{sha[:12]}")
    try:
        os.replace(p, q)
    except OSError as e:
        print(json.dumps({"status":"error","reason":"rename-failed","error":str(e)}))
        return 3
    print(json.dumps({"status":"quarantined","original":str(p),"quarantine":str(q),"bytes":len(data),"sha256":sha}))
    return 0


def parser():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    i = sub.add_parser("inspect")
    i.add_argument("--path", required=True)
    i.add_argument("--classification", choices=["rebuildable-cache","authoritative","unknown"], required=True)
    i.add_argument("--schema-version")
    i.add_argument("--runtime-owner")
    i.add_argument("--expected-sha256")
    q = sub.add_parser("quarantine")
    q.add_argument("--path", required=True)
    q.add_argument("--classification", choices=["rebuildable-cache","authoritative","unknown"], required=True)
    return ap


def main() -> int:
    try:
        args = parser().parse_args()
        return inspect(args) if args.cmd == "inspect" else quarantine(args)
    except Exception as e:
        print(json.dumps({"status":"error","error":str(e)}), file=sys.stderr)
        return 3

if __name__ == "__main__":
    raise SystemExit(main())

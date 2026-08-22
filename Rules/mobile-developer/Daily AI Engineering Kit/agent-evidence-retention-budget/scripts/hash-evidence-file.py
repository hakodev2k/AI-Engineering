#!/usr/bin/env python3
import argparse
import hashlib
import json
import os
import sys


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    p = argparse.ArgumentParser(description="Hash a local evidence file without printing its content.")
    p.add_argument("path")
    p.add_argument("--storage-ref", required=True, help="Durable reference recorded in the evidence bundle")
    p.add_argument("--output", help="Optional JSON metadata output")
    args = p.parse_args()

    if not os.path.isfile(args.path):
        print(f"not a file: {args.path}", file=sys.stderr)
        return 2
    if not args.storage_ref.strip():
        print("storage-ref must be non-empty", file=sys.stderr)
        return 2

    try:
        size = os.path.getsize(args.path)
        digest = sha256_file(args.path)
    except OSError as exc:
        print(f"read-error: {exc}", file=sys.stderr)
        return 3

    result = {
        "content_hash": f"sha256:{digest}",
        "storage_ref": args.storage_ref,
        "size_bytes": size
    }
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
            f.write("\n")
    print(result["content_hash"])
    return 0

if __name__ == "__main__":
    sys.exit(main())

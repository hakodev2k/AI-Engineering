#!/usr/bin/env python3
import hashlib
import json
import pathlib
import sys


def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def main():
    if len(sys.argv) != 2:
        print("usage: fingerprint-plan.py <plan.json>", file=sys.stderr)
        return 2
    path = pathlib.Path(sys.argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid plan: {exc}", file=sys.stderr)
        return 2
    print(hashlib.sha256(canonical(data)).hexdigest())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

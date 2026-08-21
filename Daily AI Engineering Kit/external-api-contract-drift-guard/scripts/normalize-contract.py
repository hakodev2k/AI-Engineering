#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def normalize(value):
    if isinstance(value, dict):
        return {k: normalize(value[k]) for k in sorted(value)}
    if isinstance(value, list):
        return [normalize(v) for v in value]
    return value


def main():
    p = argparse.ArgumentParser(description="Normalize a JSON contract deterministically.")
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    args = p.parse_args()

    src = Path(args.input)
    dst = Path(args.output)
    if not src.is_file():
        print(f"error: input not found: {src}", file=sys.stderr)
        return 2
    try:
        data = json.loads(src.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        print(f"error: cannot parse JSON contract: {exc}", file=sys.stderr)
        return 3

    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(json.dumps(normalize(data), indent=2, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")
    print(str(dst))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

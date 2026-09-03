#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

REQUIRED = {"version", "source_roots", "exclude_dirs", "extensions", "boundary_patterns", "propagation_patterns", "blocking_severities", "max_high_findings"}

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--config", required=True)
    args = p.parse_args()
    path = Path(args.config)
    if not path.is_file():
        print(f"config not found: {path}", file=sys.stderr); return 2
    try: data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid JSON: {exc}", file=sys.stderr); return 2
    missing = sorted(REQUIRED - data.keys())
    if missing:
        print("missing keys: " + ", ".join(missing), file=sys.stderr); return 2
    for key in ("source_roots", "exclude_dirs", "extensions", "boundary_patterns", "propagation_patterns", "blocking_severities"):
        if not isinstance(data[key], list) or not all(isinstance(x, str) and x for x in data[key]):
            print(f"{key} must be a non-empty-string list", file=sys.stderr); return 2
    if not isinstance(data["max_high_findings"], int) or data["max_high_findings"] < 0:
        print("max_high_findings must be a non-negative integer", file=sys.stderr); return 2
    print("trace-gate config valid")
    return 0

if __name__ == "__main__": raise SystemExit(main())

#!/usr/bin/env python3
import argparse, json, pathlib, sys

REQUIRED = {"source_roots", "exclude_dirs", "extensions", "outbox_terms", "transaction_terms", "dispatcher_terms", "retry_terms", "blocking_severities", "max_high_findings"}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--config", required=True)
    a = p.parse_args()
    path = pathlib.Path(a.config)
    if not path.is_file():
        print(f"config not found: {path}", file=sys.stderr); return 2
    try: data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"invalid json: {e}", file=sys.stderr); return 2
    missing = sorted(REQUIRED - set(data))
    if missing:
        print("missing keys: " + ", ".join(missing), file=sys.stderr); return 2
    for key in REQUIRED - {"max_high_findings"}:
        if not isinstance(data[key], list):
            print(f"{key} must be a list", file=sys.stderr); return 2
    if not isinstance(data["max_high_findings"], int) or data["max_high_findings"] < 0:
        print("max_high_findings must be a non-negative integer", file=sys.stderr); return 2
    print("configuration valid")
    return 0
if __name__ == "__main__": raise SystemExit(main())

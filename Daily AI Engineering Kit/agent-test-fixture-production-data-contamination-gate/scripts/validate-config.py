#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

REQUIRED = ["fixture_globs","exclude_dirs","production_domain_patterns","allowed_synthetic_domains","sensitive_key_patterns","blocking_patterns","review_patterns","high_entropy","max_file_bytes","block_on_review_findings"]

def main():
    p=argparse.ArgumentParser(); p.add_argument("--config", required=True); a=p.parse_args()
    path=Path(a.config)
    try: data=json.loads(path.read_text(encoding="utf-8"))
    except Exception as e: print(f"config error: {e}", file=sys.stderr); return 2
    missing=[k for k in REQUIRED if k not in data]
    if missing: print("missing keys: "+", ".join(missing), file=sys.stderr); return 2
    if not isinstance(data["fixture_globs"], list) or not data["fixture_globs"]: print("fixture_globs must be non-empty", file=sys.stderr); return 2
    if not isinstance(data["max_file_bytes"], int) or data["max_file_bytes"] <= 0: print("max_file_bytes must be positive integer", file=sys.stderr); return 2
    he=data["high_entropy"]
    if not isinstance(he, dict) or he.get("min_length",0) < 8 or not (0 <= he.get("min_shannon_entropy",-1) <= 8): print("invalid high_entropy", file=sys.stderr); return 2
    try:
        for group in (data["production_domain_patterns"], data["sensitive_key_patterns"], data["blocking_patterns"].values(), data["review_patterns"].values()):
            for pattern in group: re.compile(pattern)
    except re.error as e: print(f"invalid regex: {e}", file=sys.stderr); return 2
    print("config valid"); return 0
if __name__ == "__main__": raise SystemExit(main())

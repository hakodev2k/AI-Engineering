#!/usr/bin/env python3
"""Validate replay-critical task input across dispatch and resume evidence."""
import argparse, hashlib, json, sys
from pathlib import Path


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--evidence", required=True)
    args = p.parse_args()
    try:
        data = json.loads(Path(args.evidence).read_text(encoding="utf-8"))
        required = data["required_fields"]
        dispatch = data["dispatch"]
        resume = data["resume"]
        if not isinstance(required, list) or not required or not all(isinstance(x, str) for x in required):
            raise ValueError("required_fields must be a non-empty string list")
    except (OSError, json.JSONDecodeError, KeyError, ValueError) as e:
        print(json.dumps({"status":"ERROR","error":str(e)}))
        return 3
    missing = [f for f in required if f not in dispatch or f not in resume]
    mismatched = [f for f in required if f in dispatch and f in resume and digest(dispatch[f]) != digest(resume[f])]
    result = {"status":"PASS" if not missing and not mismatched else "BLOCK", "missing":missing, "mismatched":mismatched, "dispatch_digest":digest({f:dispatch.get(f) for f in required}), "resume_digest":digest({f:resume.get(f) for f in required})}
    print(json.dumps(result, sort_keys=True))
    return 0 if result["status"] == "PASS" else 2

if __name__ == "__main__":
    sys.exit(main())

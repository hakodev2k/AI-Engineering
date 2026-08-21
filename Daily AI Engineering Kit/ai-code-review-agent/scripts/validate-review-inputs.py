#!/usr/bin/env python3
import sys, json

required = ["repository", "pull_request", "files"]

def main():
    data = json.load(sys.stdin)
    missing = [k for k in required if k not in data]
    if missing:
        print(json.dumps({"valid": False, "missing": missing}))
        return 1
    print(json.dumps({"valid": True}))
    return 0

if __name__ == "__main__":
    sys.exit(main())

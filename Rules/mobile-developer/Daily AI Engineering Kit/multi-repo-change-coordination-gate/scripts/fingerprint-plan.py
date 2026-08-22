#!/usr/bin/env python3
import argparse, hashlib, json, sys


def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("plan")
    p.add_argument("--output")
    args = p.parse_args()
    try:
        with open(args.plan, "r", encoding="utf-8") as f:
            plan = json.load(f)
        digest = hashlib.sha256(canonical(plan).encode("utf-8")).hexdigest()
        result = {"plan_id": plan.get("plan_id"), "fingerprint": digest}
        text = json.dumps(result, indent=2)
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f: f.write(text + "\n")
        else:
            print(text)
        return 0
    except (OSError, json.JSONDecodeError) as e:
        print(f"fingerprint error: {e}", file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())

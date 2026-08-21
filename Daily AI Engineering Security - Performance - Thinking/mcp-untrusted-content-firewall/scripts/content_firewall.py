#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"error": f"cannot load policy: {exc}"}), file=sys.stderr)
        sys.exit(40)


def main():
    p = argparse.ArgumentParser(description="Deterministic external-content risk gate")
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("scan")
    s.add_argument("--input", required=True)
    s.add_argument("--source", required=True, choices=["trusted","reviewed","unknown","untrusted"])
    s.add_argument("--action", required=True, choices=["read","context","write","execute","network","credential","production"])
    s.add_argument("--policy", required=True)
    args = p.parse_args()

    policy = load_json(args.policy)
    try:
        text = Path(args.input).read_text(encoding="utf-8", errors="replace")
    except Exception as exc:
        print(json.dumps({"error": f"cannot read input: {exc}"}), file=sys.stderr)
        return 40

    score = policy["trust"][args.source] + policy["actions"][args.action]
    matches = []
    for rule in policy.get("patterns", []):
        try:
            if re.search(rule["regex"], text):
                score += int(rule["weight"])
                matches.append(rule["id"])
        except re.error as exc:
            print(json.dumps({"error": f"invalid rule regex {rule.get('id')}: {exc}"}), file=sys.stderr)
            return 40

    t = policy["thresholds"]
    if score >= t["block"]:
        decision, code = "block", 30
    elif score >= t["review"]:
        decision, code = "require-review", 20
    elif score >= t["taint"]:
        decision, code = "allow-with-taint", 10
    else:
        decision, code = "allow", 0

    # Privileged actions never silently pass from unknown/untrusted origin.
    if args.action in policy.get("failClosedActions", []) and args.source in {"unknown", "untrusted"} and code < 20:
        decision, code = "require-review", 20

    print(json.dumps({
        "source": args.source,
        "action": args.action,
        "score": score,
        "matches": matches,
        "decision": decision
    }, ensure_ascii=False))
    return code


if __name__ == "__main__":
    sys.exit(main())

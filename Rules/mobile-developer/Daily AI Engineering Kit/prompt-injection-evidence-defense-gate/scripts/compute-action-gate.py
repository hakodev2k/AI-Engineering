#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Compute whether a planned side effect is allowed by prompt-injection policy.")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--action", required=True)
    args = parser.parse_args()

    try:
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(json.dumps({"decision": "block", "reason": f"policy/manifest read error: {exc}"}))
        sys.exit(3)

    if manifest.get("review", {}).get("status") != "pass":
        print(json.dumps({"decision": "block", "reason": "independent review has not passed"}))
        sys.exit(2)

    blocking = set(policy.get("block_unresolved_severities", ["critical", "high"]))
    open_blocking = [
        f.get("id") for f in manifest.get("findings", [])
        if f.get("severity") in blocking and f.get("status") == "open"
    ]
    if open_blocking:
        print(json.dumps({"decision": "block", "reason": "unresolved blocking findings", "findings": open_blocking}))
        sys.exit(2)

    mapping = next((x for x in manifest.get("action_authority", []) if x.get("action") == args.action), None)
    requires_authority = args.action in set(policy.get("actions_requiring_trusted_authority", []))
    requires_human = args.action in set(policy.get("actions_requiring_human_approval", []))

    if requires_authority and mapping is None:
        print(json.dumps({"decision": "block", "reason": "no action-authority mapping"}))
        sys.exit(2)

    authority = (mapping or {}).get("authority_type", "none")
    if authority in {"untrusted-source", "none"} and requires_authority:
        print(json.dumps({"decision": "block", "reason": f"insufficient authority: {authority}"}))
        sys.exit(2)

    if requires_human and authority != "human-approval":
        print(json.dumps({"decision": "human-approval-required", "reason": "policy requires explicit human approval"}))
        sys.exit(4)

    print(json.dumps({"decision": "allow", "authority_type": authority}))


if __name__ == "__main__":
    main()

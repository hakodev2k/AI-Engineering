#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def check(event, policy):
    if not isinstance(event, dict) or not isinstance(policy, dict):
        return 3, "invalid_shape"
    allowed = event.get("request_tools")
    requested = event.get("tool_name")
    exceptions = policy.get("explicit_global_tools", [])
    if not isinstance(allowed, list) or not all(isinstance(x, str) and x for x in allowed):
        return 3, "invalid_request_tools"
    if not isinstance(requested, str) or not requested:
        return 3, "invalid_tool_name"
    if not isinstance(exceptions, list) or not all(isinstance(x, str) and x for x in exceptions):
        return 3, "invalid_global_tools"
    if requested in allowed:
        return 0, "request_member"
    if policy.get("resolver_fallback_enabled") is True and requested in exceptions:
        return 0, "explicit_global_fallback"
    return 2, "not_authorized_for_request"


def main():
    parser = argparse.ArgumentParser(description="Validate request-tool membership without executing tools")
    parser.add_argument("--event", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        event = json.loads(Path(args.event).read_text(encoding="utf-8"))
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"decision": "block", "reason": "invalid_json", "detail": str(exc)}))
        return 3
    code, reason = check(event, policy)
    print(json.dumps({"decision": "allow" if code == 0 else "block", "reason": reason}, sort_keys=True))
    return code


if __name__ == "__main__":
    sys.exit(main())

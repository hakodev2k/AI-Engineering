#!/usr/bin/env python3
"""Fail-closed authorization gate for agent/tool dispatch."""
import argparse
import json
import sys
from pathlib import Path


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"invalid input: {exc}"}), file=sys.stderr)
        raise SystemExit(2)


def evaluate(envelope):
    required = ["principal", "request_id", "capability", "effective_allowlist"]
    missing = [k for k in required if k not in envelope]
    if missing:
        return {"ok": False, "decision": "deny", "reasons": [f"missing:{k}" for k in missing]}
    allow = envelope["effective_allowlist"]
    capability = envelope["capability"]
    if not isinstance(allow, list) or not all(isinstance(x, str) for x in allow):
        return {"ok": False, "decision": "deny", "reasons": ["invalid_allowlist"]}
    if not isinstance(capability, str) or not capability:
        return {"ok": False, "decision": "deny", "reasons": ["invalid_capability"]}
    if capability not in allow:
        return {"ok": False, "decision": "deny", "reasons": ["capability_not_effectively_allowed"]}
    delegated = envelope.get("delegated_allowlist")
    if delegated is not None:
        if not isinstance(delegated, list) or not set(delegated).issubset(set(allow)):
            return {"ok": False, "decision": "deny", "reasons": ["delegation_widens_authority"]}
        if capability not in delegated:
            return {"ok": False, "decision": "deny", "reasons": ["capability_not_delegated"]}
    if envelope.get("global_resolver_fallback", False):
        return {"ok": False, "decision": "deny", "reasons": ["global_fallback_forbidden"]}
    return {
        "ok": True,
        "decision": "allow",
        "principal": envelope["principal"],
        "request_id": envelope["request_id"],
        "capability": capability,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("envelope")
    args = parser.parse_args()
    result = evaluate(load(args.envelope))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())

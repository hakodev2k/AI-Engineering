#!/usr/bin/env python3
"""Validate MCP server instructions and action-time influence.

Input JSON:
{
  "server": "name",
  "instructions": "text",
  "previous_instruction_sha256": null,
  "requested_capabilities": ["write"],
  "approval": {"granted": false, "instruction_sha256": null}
}
Exit: 0 allow, 2 invalid, 4 approval required, 5 deny.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path

ALLOW, INVALID, APPROVAL, DENY = 0, 2, 4, 5


def load(path: Path):
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def main():
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    p.add_argument("--policy", type=Path, required=True)
    a = p.parse_args()
    try:
        data, policy = load(a.input), load(a.policy)
        server = data.get("server")
        text = data.get("instructions")
        caps = data.get("requested_capabilities", [])
        approval = data.get("approval", {})
        if not isinstance(server, str) or not server.strip():
            raise ValueError("server must be non-empty string")
        if not isinstance(text, str):
            raise ValueError("instructions must be string")
        if not isinstance(caps, list) or not all(isinstance(x, str) for x in caps):
            raise ValueError("requested_capabilities must be strings")
        if not isinstance(approval, dict):
            raise ValueError("approval must be object")
        raw = text.encode("utf-8")
        sha = hashlib.sha256(raw).hexdigest()
        findings = []
        if len(raw) > int(policy.get("max_instruction_bytes", 16384)):
            findings.append("instruction exceeds byte limit")
        if policy.get("deny_control_characters", True) and any(ord(ch) < 32 and ch not in "\n\r\t" for ch in text):
            findings.append("instruction contains forbidden control characters")
        trusted = server in policy.get("trusted_servers", [])
        previous = data.get("previous_instruction_sha256")
        changed = isinstance(previous, str) and previous != sha
        high = sorted(set(caps) & set(policy.get("high_impact_capabilities", [])))
        if findings:
            result = {"decision":"deny","server":server,"instruction_sha256":sha,"trusted":trusted,"changed":changed,"high_impact":high,"findings":findings}
            code = DENY
        elif not trusted and high and policy.get("require_approval_for_untrusted_high_impact", True):
            granted = approval.get("granted") is True
            bound = approval.get("instruction_sha256") == sha
            invalidated = changed and policy.get("invalidate_approval_on_instruction_change", True)
            if granted and bound and not invalidated:
                result = {"decision":"allow","server":server,"instruction_sha256":sha,"trusted":False,"changed":changed,"high_impact":high,"findings":["action-bound approval valid"]}
                code = ALLOW
            else:
                result = {"decision":"approval_required","server":server,"instruction_sha256":sha,"trusted":False,"changed":changed,"high_impact":high,"findings":["untrusted instructions influence high-impact capability"]}
                code = APPROVAL
        else:
            result = {"decision":"allow","server":server,"instruction_sha256":sha,"trusted":trusted,"changed":changed,"high_impact":high,"findings":[]}
            code = ALLOW
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2))
    return code

if __name__ == "__main__":
    raise SystemExit(main())

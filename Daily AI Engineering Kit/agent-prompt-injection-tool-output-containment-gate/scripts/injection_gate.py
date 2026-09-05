#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path
from typing import Any


def load(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as e:
        raise ValueError(f"file not found: {path}") from e
    except json.JSONDecodeError as e:
        raise ValueError(f"invalid JSON in {path}: {e}") from e


def validate_envelope(x: Any) -> dict:
    if not isinstance(x, dict):
        raise ValueError("input must be a JSON object")
    for k in ("source", "trust", "content"):
        if k not in x:
            raise ValueError(f"missing field: {k}")
    if not isinstance(x["source"], str) or not x["source"].strip():
        raise ValueError("source must be non-empty string")
    if x["trust"] not in {"trusted", "untrusted", "unknown"}:
        raise ValueError("trust must be trusted, untrusted, or unknown")
    if not isinstance(x["content"], str):
        raise ValueError("content must be string")
    return x


def validate_policy(p: Any) -> dict:
    if not isinstance(p, dict):
        raise ValueError("policy must be object")
    for k in ("blocked_patterns", "sensitive_action_terms", "trusted_instruction_sources"):
        if not isinstance(p.get(k), list) or not all(isinstance(v, str) and v for v in p[k]):
            raise ValueError(f"{k} must be a non-empty-string array")
    return p


def locate(text: str, pattern: str) -> int:
    m = re.search(re.escape(pattern), text, re.IGNORECASE)
    return -1 if m is None else m.start()


def scan(envelope: dict, policy: dict) -> dict:
    envelope = validate_envelope(envelope)
    policy = validate_policy(policy)
    text = envelope["content"]
    matches = []
    for pat in policy["blocked_patterns"]:
        off = locate(text, pat)
        if off >= 0:
            matches.append({"kind": "blocked_pattern", "pattern": pat, "offset": off})
    for pat in policy["sensitive_action_terms"]:
        off = locate(text, pat)
        if off >= 0:
            matches.append({"kind": "sensitive_action", "pattern": pat, "offset": off})
    trusted_source = envelope["source"] in set(policy["trusted_instruction_sources"])
    risky = bool(matches) and (envelope["trust"] != "trusted" or not trusted_source)
    return {
        "status": "review" if risky else "pass",
        "source": envelope["source"],
        "trust": envelope["trust"],
        "matches": matches,
        "requires_review": risky
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Detect prompt-injection-like instructions in tool output")
    ap.add_argument("--input", required=True, type=Path)
    ap.add_argument("--policy", required=True, type=Path)
    ap.add_argument("--output", required=True, type=Path)
    a = ap.parse_args()
    try:
        report = scan(load(a.input), load(a.policy))
    except ValueError as e:
        print(json.dumps({"status":"invalid_input","error":str(e)}), file=sys.stderr)
        return 2
    a.output.parent.mkdir(parents=True, exist_ok=True)
    a.output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    if report["requires_review"]:
        print("tool output requires containment/review", file=sys.stderr)
        return 1
    print("tool output gate passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

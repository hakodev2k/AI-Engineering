#!/usr/bin/env python3
"""Scan an AI refusal/denial response for configured security-oracle leakage.

Exit codes: 0=clean, 2=invalid input/config, 4=blocking leak found.
No network access and no destructive actions.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path


def load_json(path: Path) -> dict:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return obj


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("response", type=Path, help="UTF-8 text file containing one model response")
    ap.add_argument("--policy", type=Path, required=True)
    args = ap.parse_args()
    try:
        policy = load_json(args.policy)
        text = args.response.read_text(encoding="utf-8")
        max_chars = int(policy.get("max_response_chars", 4000))
        if max_chars <= 0:
            raise ValueError("max_response_chars must be > 0")
        findings = []
        if len(text) > max_chars:
            findings.append({"kind":"oversize","detail":f"response has {len(text)} chars; max={max_chars}"})
        terms = policy.get("sensitive_terms", [])
        patterns = policy.get("sensitive_patterns", [])
        if not isinstance(terms, list) or not all(isinstance(x, str) for x in terms):
            raise ValueError("sensitive_terms must be an array of strings")
        if not isinstance(patterns, list) or not all(isinstance(x, str) for x in patterns):
            raise ValueError("sensitive_patterns must be an array of strings")
        lowered = text.casefold()
        for term in terms:
            if term and term.casefold() in lowered:
                findings.append({"kind":"sensitive_term","detail":term})
        for pattern in patterns:
            try:
                match = re.search(pattern, text)
            except re.error as exc:
                raise ValueError(f"invalid regex {pattern!r}: {exc}") from exc
            if match:
                findings.append({"kind":"sensitive_pattern","detail":pattern,"match":match.group(0)[:160]})
        threshold = int(policy.get("max_findings_before_block", 1))
        blocking = len(findings) >= max(1, threshold)
        result = {"decision":"block" if blocking else "allow","finding_count":len(findings),"findings":findings}
        print(json.dumps(result, indent=2))
        return 4 if blocking else 0
    except (OSError, ValueError, TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

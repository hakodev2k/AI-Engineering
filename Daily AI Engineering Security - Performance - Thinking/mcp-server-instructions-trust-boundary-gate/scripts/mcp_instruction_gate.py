#!/usr/bin/env python3
"""Static host-side preflight for MCP server-controlled instruction metadata."""
import argparse
import hashlib
import json
import re
import sys

BLOCK_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior|system)",
    r"override\s+(the\s+)?(system|policy|safety|approval)",
    r"bypass\s+(the\s+)?(approval|permission|policy|safety)",
    r"read\s+.*(credential|secret|token|\.env)",
    r"send\s+.*(credential|secret|token|private).*(http|external|webhook|email)",
    r"do\s+not\s+(tell|show|inform)\s+(the\s+)?user",
]
RISKY_WORDS = re.compile(r"\b(delete|write|execute|shell|command|upload|send|publish|deploy|credential|secret|token)\b", re.I)
CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def clean_text(value, max_chars):
    text = "" if value is None else str(value)
    had_control = bool(CONTROL.search(text))
    text = CONTROL.sub("", text)
    too_long = len(text) > max_chars
    return text[:max_chars], had_control, too_long


def tool_risk(tool):
    if not isinstance(tool, dict):
        return ["invalid_tool_metadata"]
    text = f"{tool.get('name','')} {tool.get('description','')}"
    findings = []
    if RISKY_WORDS.search(text):
        findings.append("side_effect_language")
    ann = tool.get("annotations") or {}
    if isinstance(ann, dict) and ann.get("readOnlyHint") is True and RISKY_WORDS.search(text):
        findings.append("readonly_claim_conflicts_with_description")
    return findings


def evaluate(data, policy="strict", max_chars=4096):
    if not isinstance(data, dict):
        raise ValueError("metadata must be a JSON object")
    trusted = data.get("trusted") is True
    instructions, had_control, too_long = clean_text(data.get("instructions", ""), max_chars)
    findings = []
    if not trusted:
        findings.append("server_metadata_untrusted")
    if had_control:
        findings.append("control_characters_removed")
    if too_long:
        findings.append("instructions_length_exceeded")
    lower = instructions.lower()
    for pattern in BLOCK_PATTERNS:
        if re.search(pattern, lower, re.I):
            findings.append("authority_or_exfiltration_pattern")
            break
    tool_findings = {}
    for idx, tool in enumerate(data.get("tools") or []):
        f = tool_risk(tool)
        if f:
            name = tool.get("name", f"tool_{idx}") if isinstance(tool, dict) else f"tool_{idx}"
            tool_findings[str(name)] = f
    privileged = bool(tool_findings)
    blocking = "authority_or_exfiltration_pattern" in findings or "instructions_length_exceeded" in findings
    if policy == "strict" and had_control:
        blocking = True
    if blocking:
        verdict = "block"
    elif not trusted or privileged:
        verdict = "require_approval"
    else:
        verdict = "allow"
    payload = {
        "server_name": str(data.get("server_name", "unknown")),
        "trusted": trusted,
        "metadata_hash": hashlib.sha256(json.dumps(data, sort_keys=True, separators=(",", ":")).encode()).hexdigest(),
        "verdict": verdict,
        "findings": sorted(set(findings)),
        "tool_findings": tool_findings,
        "sanitized_instructions": instructions,
    }
    return payload


def main():
    p = argparse.ArgumentParser()
    p.add_argument("metadata")
    p.add_argument("--policy", choices=["strict", "standard"], default="strict")
    p.add_argument("--max-chars", type=int, default=4096)
    p.add_argument("--json", action="store_true")
    a = p.parse_args()
    if a.max_chars <= 0:
        p.error("--max-chars must be positive")
    try:
        with open(a.metadata, "r", encoding="utf-8") as f:
            data = json.load(f)
        report = evaluate(data, a.policy, a.max_chars)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(report, indent=2, sort_keys=True) if a.json else report)
    return 2 if report["verdict"] == "block" else 0


if __name__ == "__main__":
    raise SystemExit(main())

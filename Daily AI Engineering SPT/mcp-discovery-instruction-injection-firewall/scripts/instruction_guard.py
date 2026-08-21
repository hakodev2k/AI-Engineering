#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
import unicodedata
from pathlib import Path

ALLOWED_TRUST = {"trusted-local", "trusted-managed", "untrusted-remote", "unknown"}


def load_json(path: str):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"CONFIG_ERROR:{exc}") from exc


def read_input(path: str) -> bytes:
    try:
        return Path(path).read_bytes()
    except Exception as exc:
        raise ValueError(f"INPUT_ERROR:{exc}") from exc


def has_disallowed_control_chars(text: str) -> bool:
    for ch in text:
        if ch in "\n\r\t":
            continue
        category = unicodedata.category(ch)
        if category in {"Cc", "Cf"}:
            return True
    return False


def normalize(raw: bytes) -> str:
    try:
        text = raw.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        raise ValueError("INVALID_UTF8") from exc
    return unicodedata.normalize("NFKC", text).replace("\r\n", "\n").replace("\r", "\n")


def inspect(text: str, raw_len: int, trust: str, config: dict) -> dict:
    reasons = []
    hard_block = False

    max_bytes = int(config.get("maxInstructionBytes", 8192))
    max_chars = int(config.get("maxInstructionChars", 8000))
    if raw_len > max_bytes:
        reasons.append("SIZE_BYTES_EXCEEDED")
        hard_block = True
    if len(text) > max_chars:
        reasons.append("SIZE_CHARS_EXCEEDED")
        hard_block = True

    if config.get("blockControlCharacters", True) and has_disallowed_control_chars(text):
        reasons.append("CONTROL_CHARACTER_DETECTED")
        hard_block = True

    lowered = text.casefold()
    suspicious_matches = []
    for pattern in config.get("suspiciousPatterns", []):
        p = str(pattern).casefold()
        if p and p in lowered:
            suspicious_matches.append(pattern)
    if suspicious_matches:
        reasons.append("SUSPICIOUS_DIRECTIVE")

    hard_matches = []
    for pattern in config.get("hardBlockPatterns", []):
        p = str(pattern).casefold()
        if p and p in lowered:
            hard_matches.append(pattern)
    if hard_matches:
        reasons.append("HARD_BLOCK_DIRECTIVE")
        hard_block = True

    if trust in {"untrusted-remote", "unknown"}:
        reasons.append("UNTRUSTED_SOURCE")

    if hard_block:
        decision = "block"
    elif trust in {"untrusted-remote", "unknown"} and suspicious_matches:
        decision = "allow-with-approval-taint"
    else:
        decision = "allow-data-envelope"

    payload_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
    result = {
        "decision": decision,
        "trust": trust,
        "tainted": trust in {"untrusted-remote", "unknown"},
        "reasonCodes": sorted(set(reasons)),
        "payloadSha256": payload_hash,
        "byteLength": raw_len,
        "charLength": len(text),
        "policyVersion": str(config.get("policyVersion", "unknown")),
    }

    if decision != "block":
        result["normalizedContent"] = text

    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Deterministic guard for remote MCP instruction text")
    parser.add_argument("--input", required=True, help="UTF-8 text file containing MCP instructions")
    parser.add_argument("--source-id", required=True, help="Stable MCP server identity for audit correlation")
    parser.add_argument("--trust", default="untrusted-remote", choices=sorted(ALLOWED_TRUST))
    parser.add_argument("--config", required=True, help="Path to policy JSON")
    args = parser.parse_args()

    try:
        config = load_json(args.config)
        raw = read_input(args.input)
        text = normalize(raw)
        result = inspect(text, len(raw), args.trust, config)
        result["sourceId"] = args.source_id
        print(json.dumps(result, ensure_ascii=False, sort_keys=True))
        return 10 if result["decision"] == "block" else 0
    except ValueError as exc:
        print(json.dumps({"decision": "block", "error": str(exc), "sourceId": args.source_id}), file=sys.stderr)
        return 20
    except Exception as exc:
        print(json.dumps({"decision": "block", "error": f"UNEXPECTED_ERROR:{type(exc).__name__}", "sourceId": args.source_id}), file=sys.stderr)
        return 30


if __name__ == "__main__":
    raise SystemExit(main())
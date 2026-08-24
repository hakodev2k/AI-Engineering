#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path

SHA256_RE = re.compile(r"^[0-9a-fA-F]{64}$")
BOUND_FIELDS = ("caller_id", "receiver_id", "task_id", "message_sha256", "action", "parameters_sha256", "purpose")


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        raise ValueError(f"cannot read valid JSON from {path}: {e}") from e


def parse_time(value):
    if not isinstance(value, str) or not value:
        raise ValueError("timestamp must be a non-empty string")
    text = value[:-1] + "+00:00" if value.endswith("Z") else value
    try:
        parsed = dt.datetime.fromisoformat(text)
    except ValueError as e:
        raise ValueError(f"invalid timestamp: {value}") from e
    if parsed.tzinfo is None:
        raise ValueError("timestamp must include timezone")
    return parsed.astimezone(dt.timezone.utc)


def used_ids(value):
    if value is None:
        return set()
    if isinstance(value, list):
        return {str(x) for x in value}
    if isinstance(value, dict):
        if isinstance(value.get("used_authorization_ids"), list):
            return {str(x) for x in value["used_authorization_ids"]}
        return {str(k) for k, v in value.items() if v}
    raise ValueError("used-authorizations must be a list or object")


def verify(envelope, request, consumed, now, max_ttl_seconds=900):
    if not isinstance(envelope, dict) or not isinstance(request, dict):
        raise ValueError("envelope and request must be JSON objects")
    findings = []
    required = ("authorization_id",) + BOUND_FIELDS + ("issued_at", "expires_at", "nonce", "max_uses")
    for field in required:
        if field not in envelope:
            findings.append(f"missing envelope field: {field}")
    for field in BOUND_FIELDS:
        if field not in request:
            findings.append(f"missing request field: {field}")
    if findings:
        return {"verified": False, "reasons": findings}
    for field in BOUND_FIELDS:
        if str(envelope[field]) != str(request[field]):
            findings.append(f"binding mismatch: {field}")
    for field in ("message_sha256", "parameters_sha256"):
        if not isinstance(envelope[field], str) or not SHA256_RE.fullmatch(envelope[field]):
            findings.append(f"invalid SHA-256 field: {field}")
    if not isinstance(envelope["authorization_id"], str) or not envelope["authorization_id"].strip():
        findings.append("authorization_id must be non-empty")
    if not isinstance(envelope["nonce"], str) or len(envelope["nonce"]) < 16:
        findings.append("nonce must contain at least 16 characters")
    if envelope["max_uses"] != 1:
        findings.append("max_uses must equal 1 for consequential actions")
    if str(envelope["authorization_id"]) in consumed:
        findings.append("authorization_id already consumed")
    try:
        issued = parse_time(envelope["issued_at"])
        expires = parse_time(envelope["expires_at"])
        if expires <= issued:
            findings.append("expires_at must be after issued_at")
        if (expires - issued).total_seconds() > max_ttl_seconds:
            findings.append(f"authorization TTL exceeds {max_ttl_seconds} seconds")
        if now < issued:
            findings.append("authorization is not yet valid")
        if now >= expires:
            findings.append("authorization has expired")
    except ValueError as e:
        findings.append(str(e))
    return {"verified": not findings, "authorization_id": envelope.get("authorization_id"), "reasons": findings}


def main():
    ap = argparse.ArgumentParser(description="Verify an exact consequential-action authorization envelope")
    ap.add_argument("envelope")
    ap.add_argument("request")
    ap.add_argument("--used-authorizations")
    ap.add_argument("--now", help="ISO-8601 time; defaults to current UTC")
    ap.add_argument("--max-ttl-seconds", type=int, default=900)
    args = ap.parse_args()
    try:
        if args.max_ttl_seconds <= 0:
            raise ValueError("max TTL must be positive")
        envelope = load_json(args.envelope)
        request = load_json(args.request)
        consumed = used_ids(load_json(args.used_authorizations)) if args.used_authorizations else set()
        now = parse_time(args.now) if args.now else dt.datetime.now(dt.timezone.utc)
        result = verify(envelope, request, consumed, now, args.max_ttl_seconds)
        print(json.dumps(result, indent=2))
        return 0 if result["verified"] else 2
    except ValueError as e:
        print(f"verify_authorization_envelope: {e}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())

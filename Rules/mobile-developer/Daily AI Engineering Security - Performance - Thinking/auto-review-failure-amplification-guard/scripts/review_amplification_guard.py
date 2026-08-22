#!/usr/bin/env python3
"""Bound repeated automatic reviews caused by the same internal sandbox failure.

Input event JSON:
{
  "timestamp": "2026-08-20T09:00:00Z",
  "scope": "expected_in_sandbox|boundary_crossing|unknown",
  "operation": "apply_patch",
  "target_class": "workspace-file",
  "failure_code": "ACCESS_DENIED",
  "failure_message": "sandbox helper access denied",
  "requested_permission": "escalated",
  "review_input_tokens": 12000
}

The state file contains only counters and hashes; raw prompts, paths and secrets are not stored.
"""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


def load(path: str, default: Any = None) -> Any:
    p = Path(path)
    if not p.exists() and default is not None:
        return default
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def parse_ts(value: str) -> datetime:
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError("timestamp must be ISO-8601") from exc
    if dt.tzinfo is None:
        raise ValueError("timestamp must include timezone")
    return dt.astimezone(timezone.utc)


def coarse_message(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[a-z]:\\[^\s]+|/[^\s]+", "<path>", value)
    value = re.sub(r"\b\d{3,}\b", "<n>", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value[:240]


def fingerprint(event: dict[str, Any]) -> str:
    safe = {
        "scope": event.get("scope"),
        "operation": event.get("operation"),
        "target_class": event.get("target_class"),
        "failure_code": event.get("failure_code"),
        "failure_message": coarse_message(str(event.get("failure_message", ""))),
        "requested_permission": event.get("requested_permission"),
    }
    raw = json.dumps(safe, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(raw.encode()).hexdigest()[:20]


def validate(event: Any) -> dict[str, Any]:
    if not isinstance(event, dict):
        raise ValueError("event must be an object")
    required = ["timestamp", "scope", "operation", "target_class", "failure_code", "requested_permission"]
    missing = [k for k in required if not event.get(k)]
    if missing:
        raise ValueError("missing fields: " + ", ".join(missing))
    if event["scope"] not in {"expected_in_sandbox", "boundary_crossing", "unknown"}:
        raise ValueError("invalid scope")
    parse_ts(str(event["timestamp"]))
    return event


def gate(event: dict[str, Any], state: dict[str, Any], max_repeats: int, window_minutes: int) -> tuple[int, dict[str, Any]]:
    now = parse_ts(str(event["timestamp"]))
    fp = fingerprint(event)
    if event["scope"] == "unknown":
        return 1, {"decision": "require_human", "fingerprint": fp, "reason": "unknown_scope"}
    if event["scope"] == "boundary_crossing":
        return 0, {"decision": "allow_review", "fingerprint": fp, "reason": "genuine_boundary_crossing"}
    entries = state.setdefault("fingerprints", {}).setdefault(fp, [])
    cutoff = now - timedelta(minutes=window_minutes)
    kept = []
    for item in entries:
        try:
            if parse_ts(item["timestamp"]) >= cutoff:
                kept.append(item)
        except (KeyError, ValueError, TypeError):
            continue
    if len(kept) >= max_repeats:
        state["fingerprints"][fp] = kept
        return 2, {"decision": "block_repeat", "fingerprint": fp, "count": len(kept), "reason": "repeat_budget_exceeded"}
    kept.append({"timestamp": now.isoformat(), "review_input_tokens": int(event.get("review_input_tokens", 0) or 0)})
    state["fingerprints"][fp] = kept
    return 0, {"decision": "allow_review", "fingerprint": fp, "count": len(kept), "reason": "within_budget"}


def main() -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    g = sub.add_parser("gate")
    g.add_argument("--event", required=True); g.add_argument("--state", required=True)
    g.add_argument("--max-repeats", type=int, default=3); g.add_argument("--window-minutes", type=int, default=30)
    args = ap.parse_args()
    try:
        event = validate(load(args.event))
        state = load(args.state, {"fingerprints": {}})
        if not isinstance(state, dict): raise ValueError("state must be an object")
        if args.max_repeats < 1 or args.window_minutes < 1: raise ValueError("budgets must be positive")
        code, result = gate(event, state, args.max_repeats, args.window_minutes)
        Path(args.state).write_text(json.dumps(state, indent=2, sort_keys=True), encoding="utf-8")
        print(json.dumps(result, sort_keys=True))
        return code
    except (ValueError, OSError) as exc:
        print(f"error: {exc}", file=sys.stderr); return 1

if __name__ == "__main__":
    raise SystemExit(main())
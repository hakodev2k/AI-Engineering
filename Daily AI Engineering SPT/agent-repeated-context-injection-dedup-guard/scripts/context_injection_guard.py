#!/usr/bin/env python3
"""Deterministic admission guard for host-generated AI context events.

Input: JSON Lines events with fields:
  turn: int
  source: str
  logical_key: str
  content: str
  always_include: bool (optional)
  version: str|int (optional)

Output: JSON Lines decisions with action=include|suppress|reject.
The script never modifies source files and never calls a model or network service.

Exit codes:
  0 decisions completed without policy violation
  2 required-context suppression/rejection policy violation
  3 invalid input/configuration
  4 I/O/runtime failure
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass
class Policy:
    mode: str
    freshness_turns: int
    ledger_max_entries: int
    max_payload_bytes: int
    chars_per_token: float
    min_suppressible_tokens: int
    sources: dict[str, dict[str, Any]]
    normalization: dict[str, Any]


def load_policy(path: Path) -> Policy:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot load policy: {exc}") from exc
    try:
        return Policy(
            mode=str(data.get("mode", "enforce")),
            freshness_turns=int(data["freshness_turns"]),
            ledger_max_entries=int(data["ledger_max_entries"]),
            max_payload_bytes=int(data["max_payload_bytes"]),
            chars_per_token=float(data["token_estimator_chars_per_token"]),
            min_suppressible_tokens=int(data["min_suppressible_tokens"]),
            sources=dict(data["sources"]),
            normalization=dict(data.get("normalization", {})),
        )
    except Exception as exc:
        raise ValueError(f"invalid policy shape: {exc}") from exc


def normalize(content: str, cfg: dict[str, Any]) -> str:
    value = content
    if cfg.get("normalize_newlines", True):
        value = value.replace("\r\n", "\n").replace("\r", "\n")
    if cfg.get("trim_trailing_whitespace", True):
        value = "\n".join(line.rstrip() for line in value.split("\n"))
    if cfg.get("collapse_blank_lines", False):
        out: list[str] = []
        blank = False
        for line in value.split("\n"):
            if line == "":
                if blank:
                    continue
                blank = True
            else:
                blank = False
            out.append(line)
        value = "\n".join(out)
    return value.strip()


def fingerprint(source: str, logical_key: str, normalized: str) -> str:
    material = f"{source}\0{logical_key}\0{normalized}".encode("utf-8")
    return hashlib.sha256(material).hexdigest()


def estimate_tokens(text: str, chars_per_token: float) -> int:
    if not text:
        return 0
    return max(1, int((len(text) / chars_per_token) + 0.999999))


def required_for_event(event: dict[str, Any], source_cfg: dict[str, Any]) -> bool:
    if "always_include" in event:
        return bool(event["always_include"])
    return bool(source_cfg.get("default_always_include", False))


def process(events: list[dict[str, Any]], policy: Policy) -> tuple[list[dict[str, Any]], bool]:
    ledger: dict[str, dict[str, Any]] = {}
    order: list[str] = []
    decisions: list[dict[str, Any]] = []
    violation = False

    for idx, event in enumerate(events, start=1):
        try:
            turn = int(event["turn"])
            source = str(event["source"])
            logical_key = str(event["logical_key"])
            content = str(event["content"])
        except Exception as exc:
            raise ValueError(f"event {idx}: missing/invalid required field: {exc}") from exc

        raw_bytes = len(content.encode("utf-8"))
        source_cfg = policy.sources.get(source, {"deduplicate": False, "default_always_include": True})
        required = required_for_event(event, source_cfg)
        normalized = normalize(content, policy.normalization)
        fp = fingerprint(source, logical_key, normalized)
        tokens = estimate_tokens(normalized, policy.chars_per_token)
        previous = ledger.get(logical_key)

        if raw_bytes > policy.max_payload_bytes:
            action = "include" if required else "reject"
            reason = "payload_too_large_required" if required else "payload_too_large"
        elif required or not bool(source_cfg.get("deduplicate", False)):
            action = "include"
            reason = "required_or_source_not_deduplicated"
        elif tokens < policy.min_suppressible_tokens:
            action = "include"
            reason = "below_min_suppressible_tokens"
        elif previous and previous["fingerprint"] == fp and (turn - int(previous["last_seen_turn"])) <= policy.freshness_turns:
            action = "suppress" if policy.mode == "enforce" else "include"
            reason = "exact_duplicate_within_freshness_window"
        else:
            action = "include"
            reason = "first_seen_or_changed_or_stale"

        if required and action != "include":
            violation = True

        if action == "include":
            if logical_key not in ledger:
                order.append(logical_key)
            ledger[logical_key] = {
                "fingerprint": fp,
                "last_seen_turn": turn,
                "version": event.get("version"),
            }
        elif action == "suppress" and previous:
            previous["last_seen_turn"] = turn

        while len(order) > policy.ledger_max_entries:
            oldest = order.pop(0)
            ledger.pop(oldest, None)

        decisions.append({
            "index": idx,
            "turn": turn,
            "source": source,
            "logical_key": logical_key,
            "fingerprint": fp,
            "estimated_tokens": tokens,
            "required": required,
            "action": action,
            "reason": reason,
            "content_in_output": content if action == "include" else None,
        })

    return decisions, violation


def read_events(path: Path) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {line_no}: invalid JSON: {exc}") from exc
        if not isinstance(item, dict):
            raise ValueError(f"line {line_no}: event must be an object")
        events.append(item)
    return events


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--policy", required=True, type=Path)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    try:
        policy = load_policy(args.policy)
        events = read_events(args.input)
        decisions, violation = process(events, policy)
        rendered = "\n".join(json.dumps(d, ensure_ascii=False, separators=(",", ":")) for d in decisions) + ("\n" if decisions else "")
        if args.output:
            args.output.write_text(rendered, encoding="utf-8")
        else:
            sys.stdout.write(rendered)
        return 2 if violation else 0
    except ValueError as exc:
        print(f"input/config error: {exc}", file=sys.stderr)
        return 3
    except Exception as exc:
        print(f"runtime error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())

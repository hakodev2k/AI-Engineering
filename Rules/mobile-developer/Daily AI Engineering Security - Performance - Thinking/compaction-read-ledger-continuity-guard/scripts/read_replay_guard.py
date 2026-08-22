#!/usr/bin/env python3
"""Profile unchanged artifact re-reads and token replay across compaction.

Input JSON:
{
  "compaction_turns": [5],
  "events": [
    {"turn":1,"artifact":"src/a.py","content_sha256":"abc","tokens":1000},
    {"turn":6,"artifact":"src/a.py","content_sha256":"abc","tokens":1000}
  ],
  "provider_usage": [{"input_tokens":1000,"cache_read_tokens":12000}]
}
Exit: 0 within budget, 2 invalid, 3 replay budget exceeded.
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

PASS, INVALID, EXCEEDED = 0, 2, 3


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def nonneg_number(value, name: str) -> float:
    if not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{name} must be non-negative number")
    return float(value)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    p.add_argument("--config", required=True, type=Path)
    a = p.parse_args()
    try:
        data, cfg = load(a.input), load(a.config)
        events = data.get("events", [])
        compactions = data.get("compaction_turns", [])
        usage = data.get("provider_usage", [])
        if not isinstance(events, list) or not isinstance(compactions, list) or not isinstance(usage, list):
            raise ValueError("events, compaction_turns and provider_usage must be arrays")
        if not all(isinstance(x, int) and not isinstance(x, bool) and x >= 0 for x in compactions):
            raise ValueError("compaction_turns must contain non-negative integers")
        compactions = sorted(compactions)
        seen: dict[tuple[str, str], int] = {}
        duplicate_tokens = 0.0
        total_tokens = 0.0
        duplicates = []
        post_compaction_duplicates = []
        for idx, event in enumerate(events):
            if not isinstance(event, dict):
                raise ValueError(f"events[{idx}] must be object")
            turn = event.get("turn")
            artifact = event.get("artifact")
            sha = event.get("content_sha256")
            if not isinstance(turn, int) or isinstance(turn, bool) or turn < 0:
                raise ValueError(f"events[{idx}].turn must be non-negative integer")
            if not isinstance(artifact, str) or not artifact:
                raise ValueError(f"events[{idx}].artifact must be non-empty string")
            if cfg.get("require_content_hash", True) and (not isinstance(sha, str) or not sha):
                raise ValueError(f"events[{idx}].content_sha256 required")
            if not isinstance(sha, str):
                sha = ""
            tokens = nonneg_number(event.get("tokens", 0), f"events[{idx}].tokens")
            total_tokens += tokens
            key = (artifact, sha)
            if key in seen:
                duplicate_tokens += tokens
                item = {"artifact": artifact, "content_sha256": sha, "turn": turn, "first_turn": seen[key], "tokens": tokens}
                duplicates.append(item)
                if any(seen[key] <= c < turn for c in compactions):
                    post_compaction_duplicates.append(item)
            else:
                seen[key] = turn
        ratio = duplicate_tokens / total_tokens if total_tokens else 0.0
        cache_read = input_tokens = 0.0
        for idx, item in enumerate(usage):
            if not isinstance(item, dict):
                raise ValueError(f"provider_usage[{idx}] must be object")
            cache_read += nonneg_number(item.get("cache_read_tokens", 0), f"provider_usage[{idx}].cache_read_tokens")
            input_tokens += nonneg_number(item.get("input_tokens", 0), f"provider_usage[{idx}].input_tokens")
        cache_ratio = cache_read / input_tokens if input_tokens else 0.0
        violations = []
        min_events = int(cfg.get("minimum_events_for_ratio_gate", 2))
        if len(events) >= min_events and ratio > float(cfg.get("max_duplicate_read_token_ratio", 0.15)):
            violations.append(f"duplicate read token ratio {ratio:.4f} exceeds budget")
        if len(post_compaction_duplicates) > int(cfg.get("max_post_compaction_duplicate_reads", 0)):
            violations.append("post-compaction unchanged reads exceed budget")
        if input_tokens and cache_ratio > float(cfg.get("max_cache_read_to_input_ratio", 10.0)):
            violations.append(f"cache_read/input ratio {cache_ratio:.4f} exceeds budget")
        result = {
            "decision": "block" if violations else "pass",
            "event_count": len(events),
            "unique_content_reads": len(seen),
            "duplicate_same_content_reads": len(duplicates),
            "post_compaction_duplicate_reads": len(post_compaction_duplicates),
            "total_read_tokens": total_tokens,
            "duplicate_read_tokens": duplicate_tokens,
            "duplicate_read_token_ratio": round(ratio, 6),
            "cache_read_to_input_ratio": round(cache_ratio, 6),
            "duplicates": duplicates,
            "violations": violations,
        }
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, sort_keys=True))
    return EXCEEDED if violations else PASS


if __name__ == "__main__":
    raise SystemExit(main())

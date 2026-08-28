#!/usr/bin/env python3
"""Budget provider-specific signature metadata without breaking active replay.

Input is a JSON object with `turns`, where each turn may contain:
  {"role": "model", "active_loop": true|false, "parts": [...]}
Parts may contain thoughtSignature/thought_signature/textSignature and a type
such as functionCall/function_call/text. The script emits a transformed copy
and a machine-readable ledger. It never mutates the input file.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("input must be a JSON object")
    return data


def signature_value(part: dict[str, Any], fields: list[str]) -> tuple[str | None, str | None]:
    found = [(f, part[f]) for f in fields if f in part]
    if len(found) > 1:
        raise ValueError("part contains multiple configured signature fields")
    if not found:
        return None, None
    field, value = found[0]
    if not isinstance(value, str) or not value:
        raise ValueError(f"{field} must be a non-empty string")
    return field, value


def classify(turn_index: int, total_turns: int, turn: dict[str, Any], part: dict[str, Any], policy: dict[str, Any]) -> str:
    part_type = str(part.get("type", ""))
    active = bool(turn.get("active_loop", False))
    required_types = set(policy.get("required_active_part_types", ["functionCall", "function_call"]))
    if active and part_type in required_types:
        return "required_active"
    recent_turns = max(0, int(policy.get("recent_turns", 4)))
    if turn_index >= max(0, total_turns - recent_turns):
        return "recommended_recent"
    return "archival"


def transform(payload: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    turns = payload.get("turns")
    if not isinstance(turns, list):
        raise ValueError("input must contain a turns array")
    fields = policy.get("signature_fields", ["thoughtSignature", "thought_signature", "textSignature"])
    if not isinstance(fields, list) or not all(isinstance(x, str) and x for x in fields):
        raise ValueError("signature_fields must be a non-empty string array")

    output = copy.deepcopy(payload)
    out_turns = output["turns"]
    recommended_budget = max(0, int(policy.get("max_recommended_signature_bytes", 65536)))
    bytes_per_token = float(policy.get("estimated_bytes_per_token", 4.0))
    if bytes_per_token <= 0:
        raise ValueError("estimated_bytes_per_token must be > 0")
    reserved_tokens = max(0, int(policy.get("reserved_context_tokens", 20000)))
    keep_hashes = bool(policy.get("retain_archival_hashes", True))
    fail_missing = bool(policy.get("fail_if_required_signature_missing", True))
    fail_required_over = bool(policy.get("fail_if_required_signatures_exceed_reserved_tokens", True))

    ledger: list[dict[str, Any]] = []
    required_bytes = 0
    recommended_kept = 0
    removed_bytes = 0
    errors: list[str] = []

    for ti, (turn, out_turn) in enumerate(zip(turns, out_turns)):
        if not isinstance(turn, dict) or not isinstance(out_turn, dict):
            raise ValueError(f"turn {ti} must be an object")
        parts = turn.get("parts", [])
        out_parts = out_turn.get("parts", [])
        if not isinstance(parts, list) or not isinstance(out_parts, list):
            raise ValueError(f"turn {ti}.parts must be an array")
        if len(parts) != len(out_parts):
            raise ValueError("internal part count mismatch")

        for pi, (part, out_part) in enumerate(zip(parts, out_parts)):
            if not isinstance(part, dict) or not isinstance(out_part, dict):
                raise ValueError(f"turn {ti} part {pi} must be an object")
            field, value = signature_value(part, fields)
            part_type = str(part.get("type", ""))
            active = bool(turn.get("active_loop", False))
            required_types = set(policy.get("required_active_part_types", ["functionCall", "function_call"]))

            if field is None:
                if active and part_type in required_types and fail_missing:
                    errors.append(f"missing_required_signature:turn={ti}:part={pi}")
                continue

            raw_bytes = len(value.encode("utf-8"))
            bucket = classify(ti, len(turns), turn, part, policy)
            action = "keep"

            if bucket == "required_active":
                required_bytes += raw_bytes
            elif bucket == "recommended_recent":
                if recommended_kept + raw_bytes <= recommended_budget:
                    recommended_kept += raw_bytes
                else:
                    del out_part[field]
                    removed_bytes += raw_bytes
                    action = "strip_budget_exceeded"
                    if keep_hashes:
                        out_part["signature_archive"] = {
                            "field": field,
                            "sha256": hashlib.sha256(value.encode("utf-8")).hexdigest(),
                            "bytes": raw_bytes,
                        }
            else:
                del out_part[field]
                removed_bytes += raw_bytes
                action = "strip_archival"
                if keep_hashes:
                    out_part["signature_archive"] = {
                        "field": field,
                        "sha256": hashlib.sha256(value.encode("utf-8")).hexdigest(),
                        "bytes": raw_bytes,
                    }

            ledger.append({
                "turn": ti,
                "part": pi,
                "field": field,
                "classification": bucket,
                "bytes": raw_bytes,
                "action": action,
            })

    required_estimated_tokens = required_bytes / bytes_per_token
    if fail_required_over and required_estimated_tokens > reserved_tokens:
        errors.append("required_signature_budget_exceeds_reserved_context_tokens")

    before_signature_bytes = sum(item["bytes"] for item in ledger)
    after_signature_bytes = before_signature_bytes - removed_bytes
    return {
        "ok": not errors,
        "decision": "allow" if not errors else "block",
        "errors": errors,
        "metrics": {
            "signature_bytes_before": before_signature_bytes,
            "signature_bytes_after": after_signature_bytes,
            "signature_bytes_removed": removed_bytes,
            "required_signature_bytes": required_bytes,
            "required_signature_estimated_tokens": round(required_estimated_tokens, 2),
            "recommended_signature_bytes_kept": recommended_kept,
        },
        "ledger": ledger,
        "transformed": output,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Classify and budget provider signature metadata")
    parser.add_argument("--input", required=True, help="History JSON")
    parser.add_argument("--policy", required=True, help="Policy JSON")
    args = parser.parse_args()
    try:
        result = transform(load_json(args.input), load_json(args.policy))
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "error", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())

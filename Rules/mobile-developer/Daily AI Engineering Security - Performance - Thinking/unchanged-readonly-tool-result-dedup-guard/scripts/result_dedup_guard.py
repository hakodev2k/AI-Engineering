#!/usr/bin/env python3
"""Decide whether an eligible read-only tool result can be replaced by an unchanged reference."""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def load_obj(path: Path, allow_missing: bool = False) -> dict:
    if allow_missing and not path.exists():
        return {}
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return obj


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--ledger", type=Path, required=True)
    p.add_argument("--input", type=Path, required=True)
    p.add_argument("--write-ledger", action="store_true")
    a = p.parse_args()
    try:
        data = load_obj(a.input)
        ledger = load_obj(a.ledger, allow_missing=True)
        tool = data.get("tool")
        rid = data.get("resource_id")
        result = data.get("result")
        read_only = data.get("read_only")
        exact = data.get("exact_bytes_required", False)
        freshness = data.get("freshness")
        if not isinstance(tool, str) or not tool:
            raise ValueError("tool must be a non-empty string")
        if not isinstance(rid, str) or not rid:
            raise ValueError("resource_id must be a non-empty string")
        if not isinstance(result, str):
            raise ValueError("result must be a string")
        if not isinstance(read_only, bool) or not isinstance(exact, bool):
            raise ValueError("read_only/exact_bytes_required must be booleans")
        if freshness is not None:
            if not isinstance(freshness, dict) or not isinstance(freshness.get("kind"), str) or not isinstance(freshness.get("value"), str):
                raise ValueError("freshness must contain string kind/value")
        raw = result.encode("utf-8")
        digest = hashlib.sha256(raw).hexdigest()
        previous = ledger.get(rid)
        decision, reason = "full", "first_or_changed_result"
        if not read_only:
            decision, reason = "bypass", "tool_not_read_only"
        elif exact:
            decision, reason = "bypass", "exact_bytes_required"
        elif freshness is None:
            decision, reason = "full", "freshness_unavailable"
        elif isinstance(previous, dict) and previous.get("digest") == digest and previous.get("freshness") == freshness:
            decision, reason = "unchanged_reference", "digest_and_freshness_match"
        out = {"decision": decision, "reason": reason, "tool": tool, "resource_id": rid, "digest": digest, "bytes": len(raw), "freshness": freshness}
        if decision == "unchanged_reference":
            out["reference"] = {"resource_id": rid, "digest": digest, "unchanged": True, "bytes_avoided": len(raw)}
        if a.write_ledger and decision in {"full", "bypass"} and read_only and freshness is not None:
            ledger[rid] = {"digest": digest, "freshness": freshness, "bytes": len(raw)}
            tmp = a.ledger.with_suffix(a.ledger.suffix + ".tmp")
            tmp.write_text(json.dumps(ledger, indent=2, sort_keys=True) + "\n", encoding="utf-8")
            tmp.replace(a.ledger)
        print(json.dumps(out, indent=2, sort_keys=True))
        return 0
    except (ValueError, OSError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

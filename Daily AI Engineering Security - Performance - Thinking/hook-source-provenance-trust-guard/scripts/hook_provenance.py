#!/usr/bin/env python3
"""Build and verify a source-scoped hook provenance ledger without executing hooks."""
import argparse
import hashlib
import json
import sys
from pathlib import Path


def canonical_hook(hook):
    if not isinstance(hook, dict):
        raise ValueError("hook must be an object")
    for key in ("source_id", "event", "command"):
        if not isinstance(hook.get(key), str) or not hook[key].strip():
            raise ValueError(f"missing {key}")
    return {
        "source_id": hook["source_id"].strip(),
        "source_version": str(hook.get("source_version", "unknown")),
        "event": hook["event"].strip(),
        "command": hook["command"],
    }


def record(hook):
    item = canonical_hook(hook)
    digest = hashlib.sha256(item["command"].encode("utf-8")).hexdigest()
    return {
        "source_id": item["source_id"],
        "source_version": item["source_version"],
        "event": item["event"],
        "command_sha256": digest,
    }


def build(hooks):
    records = [record(h) for h in hooks]
    records.sort(key=lambda r: (r["source_id"], r["event"], r["command_sha256"]))
    return {"schema_version": 1, "records": records}


def verify(hooks, ledger, source=None):
    expected = build(hooks)["records"]
    actual = ledger.get("records", [])
    if source:
        expected = [r for r in expected if r["source_id"] == source]
        actual = [r for r in actual if r.get("source_id") == source]
    expected_set = {json.dumps(r, sort_keys=True) for r in expected}
    actual_set = {json.dumps(r, sort_keys=True) for r in actual}
    return {
        "ok": expected_set == actual_set,
        "missing": [json.loads(x) for x in sorted(expected_set - actual_set)],
        "stale": [json.loads(x) for x in sorted(actual_set - expected_set)],
    }


def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser()
    subs = parser.add_subparsers(dest="cmd", required=True)
    build_parser = subs.add_parser("build")
    build_parser.add_argument("hooks")
    build_parser.add_argument("--output", required=True)
    verify_parser = subs.add_parser("verify")
    verify_parser.add_argument("hooks")
    verify_parser.add_argument("ledger")
    verify_parser.add_argument("--source")
    args = parser.parse_args()
    try:
        if args.cmd == "build":
            hooks = load(args.hooks)
            if not isinstance(hooks, list):
                raise ValueError("hooks file must be a JSON array")
            output = build(hooks)
            Path(args.output).write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
            print(f"wrote {len(output['records'])} records")
            return 0
        hooks = load(args.hooks)
        ledger = load(args.ledger)
        if not isinstance(hooks, list):
            raise ValueError("hooks file must be a JSON array")
        result = verify(hooks, ledger, args.source)
        print(json.dumps(result, sort_keys=True))
        return 0 if result["ok"] else 1
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

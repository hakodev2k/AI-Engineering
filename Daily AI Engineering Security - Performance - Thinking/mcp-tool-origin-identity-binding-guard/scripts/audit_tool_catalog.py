#!/usr/bin/env python3
"""Audit an MCP tool catalog for origin/identity ambiguity.

Input is a JSON array of either fully derived identity records or raw records
accepted by tool_identity_guard. Exit codes: 0 clean, 2 invalid input,
3 blocking findings, 4 I/O error.
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List

from tool_identity_guard import derive


def normalize_alias(alias: str) -> str:
    return alias.casefold().replace("-", "_")


def load_catalog(path: str) -> List[Dict[str, Any]]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except OSError as exc:
        raise IOError(str(exc)) from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}") from exc
    if not isinstance(data, list):
        raise ValueError("catalog must be a JSON array")
    result = []
    for i, item in enumerate(data):
        if not isinstance(item, dict):
            raise ValueError(f"catalog[{i}] must be an object")
        result.append(derive(item) if "input_schema" in item else item)
    return result


def audit(entries: List[Dict[str, Any]]) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    by_id = defaultdict(list)
    by_alias = defaultdict(list)
    by_norm = defaultdict(list)
    by_reported_name = defaultdict(set)
    by_instance_tool = defaultdict(list)

    required = {
        "canonical_id", "server_instance_id", "origin_fingerprint",
        "connection_generation", "tool_name", "schema_digest", "display_alias"
    }
    for idx, e in enumerate(entries):
        missing = sorted(required - set(e))
        if missing:
            findings.append({"severity": "blocking", "type": "missing_fields", "index": idx, "fields": missing})
            continue
        by_id[e["canonical_id"]].append(e)
        by_alias[e["display_alias"]].append(e)
        by_norm[normalize_alias(e["display_alias"])].append(e)
        by_instance_tool[(e["server_instance_id"], e["tool_name"])].append(e)
        reported = e.get("server_reported_name")
        if isinstance(reported, str) and reported:
            by_reported_name[reported].add(e["server_instance_id"])

    for cid, group in by_id.items():
        fingerprints = {(e["origin_fingerprint"], e["schema_digest"], e["connection_generation"], e["tool_name"]) for e in group}
        if len(fingerprints) > 1:
            findings.append({"severity": "blocking", "type": "canonical_id_conflict", "canonical_id": cid, "count": len(group)})

    for alias, group in by_alias.items():
        ids = sorted({e["canonical_id"] for e in group})
        if len(ids) > 1:
            findings.append({"severity": "blocking", "type": "ambiguous_alias", "alias": alias, "canonical_ids": ids})

    for alias, group in by_norm.items():
        ids = sorted({e["canonical_id"] for e in group})
        raw = sorted({e["display_alias"] for e in group})
        if len(ids) > 1 and len(raw) > 1:
            findings.append({"severity": "blocking", "type": "normalization_collision", "normalized_alias": alias, "aliases": raw, "canonical_ids": ids})

    for reported, instance_ids in by_reported_name.items():
        if len(instance_ids) > 1:
            findings.append({"severity": "warning", "type": "reused_server_reported_name", "server_reported_name": reported, "server_instance_ids": sorted(instance_ids)})

    for (instance_id, tool_name), group in by_instance_tool.items():
        generations = sorted({e["connection_generation"] for e in group})
        live = [e for e in group if e.get("live", True)]
        if len(live) > 1 and len({e["canonical_id"] for e in live}) > 1:
            findings.append({"severity": "blocking", "type": "multiple_live_generations", "server_instance_id": instance_id, "tool_name": tool_name, "generations": generations})

    blocking = sum(1 for f in findings if f["severity"] == "blocking")
    return {
        "entries": len(entries),
        "blocking_findings": blocking,
        "warning_findings": len(findings) - blocking,
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("catalog")
    args = parser.parse_args()
    try:
        result = audit(load_catalog(args.catalog))
        print(json.dumps(result, indent=2, sort_keys=True))
        return 3 if result["blocking_findings"] else 0
    except ValueError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 2
    except IOError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())

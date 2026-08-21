#!/usr/bin/env python3
"""Decide whether to emit a fresh tool result in full or as a reuse marker.

The tool MUST already have executed. This script never skips execution and therefore
never acts as an execution cache. It only removes duplicate model-visible payload when
all safety conditions hold.

Input JSON fields:
  tool_name, normalized_arguments, read_only, success, output, context_epoch,
  prior: optional {sha256, context_epoch, full_payload_visible}

Exit codes: 0 full payload, 10 reuse marker, 2 invalid input.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import sys
from pathlib import Path

FULL, REUSE, INVALID = 0, 10, 2


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def canonical_args(value) -> str:
    try:
        return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"normalized_arguments must be JSON-serializable: {exc}") from exc


def result_hash(tool: str, args: str, output: str) -> str:
    material = (tool + "\0" + args + "\0" + output).encode("utf-8")
    return hashlib.sha256(material).hexdigest()


def decide(data: dict, policy: dict) -> tuple[dict, int]:
    tool = data.get("tool_name")
    output = data.get("output")
    epoch = data.get("context_epoch")
    read_only = data.get("read_only")
    success = data.get("success")
    if not isinstance(tool, str) or not tool:
        raise ValueError("tool_name must be a non-empty string")
    if not isinstance(output, str):
        raise ValueError("output must be a string")
    if not isinstance(epoch, str) or not epoch:
        raise ValueError("context_epoch must be a non-empty string")
    if not isinstance(read_only, bool) or not isinstance(success, bool):
        raise ValueError("read_only and success must be booleans")
    args = canonical_args(data.get("normalized_arguments", {}))
    sha = result_hash(tool, args, output)
    payload_bytes = len(output.encode("utf-8"))
    prior = data.get("prior") or {}
    if not isinstance(prior, dict):
        raise ValueError("prior must be an object")

    reasons: list[str] = []
    eligible = policy.get("enabled", True)
    if not eligible:
        reasons.append("gate disabled")
    if policy.get("require_explicit_read_only_annotation", True) and not read_only:
        eligible = False; reasons.append("tool is not explicitly read-only")
    allowlist = policy.get("eligible_read_only_tools", [])
    if allowlist and tool not in allowlist:
        eligible = False; reasons.append("tool not in eligible allowlist")
    if policy.get("never_elide_errors", True) and not success:
        eligible = False; reasons.append("result is error/unsuccessful")
    if payload_bytes < int(policy.get("min_payload_bytes", 512)):
        eligible = False; reasons.append("payload below minimum size")
    same = prior.get("sha256") == sha
    if not same:
        eligible = False; reasons.append("fresh output differs or has no prior identity")
    same_epoch = prior.get("context_epoch") == epoch
    if policy.get("invalidate_visibility_on_epoch_change", True) and not same_epoch:
        eligible = False; reasons.append("context epoch changed")
    if prior.get("full_payload_visible") is not True:
        eligible = False; reasons.append("prior full payload is not proven visible")

    template = str(policy.get("marker_template", "[tool-result-reuse] sha256={sha256} bytes={bytes}"))
    marker = template.format(sha256=sha, bytes=payload_bytes, tool=tool)
    marker_bytes = len(marker.encode("utf-8"))
    ratio = float(policy.get("max_marker_ratio", 0.5))
    if marker_bytes >= payload_bytes * ratio:
        eligible = False; reasons.append("marker savings below configured threshold")

    if eligible:
        return {
            "decision": "reuse_marker",
            "model_payload": marker,
            "sha256": sha,
            "payload_bytes": payload_bytes,
            "emitted_bytes": marker_bytes,
            "saved_bytes": payload_bytes - marker_bytes,
            "context_epoch": epoch,
            "fresh_execution_preserved": True,
            "reasons": []
        }, REUSE
    return {
        "decision": "full_payload",
        "model_payload": output,
        "sha256": sha,
        "payload_bytes": payload_bytes,
        "emitted_bytes": payload_bytes,
        "saved_bytes": 0,
        "context_epoch": epoch,
        "fresh_execution_preserved": True,
        "visibility_record": {"sha256": sha, "context_epoch": epoch, "full_payload_visible": True},
        "reasons": reasons
    }, FULL


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    args = parser.parse_args()
    try:
        result, code = decide(load(args.input), load(args.policy))
    except (ValueError, TypeError, KeyError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return code


if __name__ == "__main__":
    raise SystemExit(main())

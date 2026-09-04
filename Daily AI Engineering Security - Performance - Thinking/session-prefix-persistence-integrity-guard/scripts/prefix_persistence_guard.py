#!/usr/bin/env python3
"""Verify exact cache-sensitive prefix integrity across session persistence/resume.

Input JSON shape:
{
  "runtime_identity": {"provider": "...", "model": "...", "toolset_hash": "...", "renderer_version": "..."},
  "prefix_segments": [{"name": "system", "content": "..."}, ...]
}

The program never prints segment contents. Exit codes: 0 allow, 2 integrity/rebaseline block, 3 invalid input.
"""
import argparse
import hashlib
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def validate(doc, cfg, label):
    identity = doc.get("runtime_identity")
    segments = doc.get("prefix_segments")
    if not isinstance(identity, dict):
        raise ValueError(f"{label}.runtime_identity must be an object")
    missing = [k for k in cfg.get("required_runtime_identity_fields", []) if not identity.get(k)]
    if missing:
        raise ValueError(f"{label} missing runtime identity fields: {','.join(missing)}")
    if not isinstance(segments, list):
        raise ValueError(f"{label}.prefix_segments must be a list")
    if cfg.get("require_nonempty_prefix", True) and not segments:
        raise ValueError(f"{label} prefix is empty")
    for index, segment in enumerate(segments):
        if not isinstance(segment, dict) or not isinstance(segment.get("name"), str) or not isinstance(segment.get("content"), str):
            raise ValueError(f"{label}.prefix_segments[{index}] must contain string name/content")
    return identity, segments


def serialize_segments(segments):
    # Length-prefix each segment to make boundaries unambiguous while preserving exact content bytes.
    out = bytearray()
    for seg in segments:
        name = seg["name"].encode("utf-8")
        content = seg["content"].encode("utf-8")
        out.extend(len(name).to_bytes(4, "big")); out.extend(name)
        out.extend(len(content).to_bytes(8, "big")); out.extend(content)
    return bytes(out)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def first_diff(a, b):
    limit = min(len(a), len(b))
    for i in range(limit):
        if a[i] != b[i]:
            return i
    return limit if len(a) != len(b) else None


def analyze(baseline, resumed, cfg):
    b_identity, b_segments = validate(baseline, cfg, "baseline")
    r_identity, r_segments = validate(resumed, cfg, "resumed")
    b_bytes = serialize_segments(b_segments)
    r_bytes = serialize_segments(r_segments)
    b_names = [s["name"] for s in b_segments]
    r_names = [s["name"] for s in r_segments]

    common = {
        "baseline_hash": sha(b_bytes),
        "resumed_hash": sha(r_bytes),
        "baseline_bytes": len(b_bytes),
        "resumed_bytes": len(r_bytes),
        "baseline_segments": b_names,
        "resumed_segments": r_names,
    }

    if b_identity != r_identity:
        return 2, {"decision": "block", "classification": "rebaseline_required", "runtime_identity_changed": True, **common}
    if not b_segments or not r_segments:
        return 2, {"decision": "block", "classification": "missing_prefix_state", **common}
    if cfg.get("require_segment_order_match", True) and b_names != r_names:
        return 2, {"decision": "block", "classification": "segment_order_or_membership_drift", "first_diff_byte": first_diff(b_bytes, r_bytes), **common}
    if b_bytes != r_bytes:
        return 2, {"decision": "block", "classification": "prefix_byte_drift", "first_diff_byte": first_diff(b_bytes, r_bytes), **common}
    return 0, {"decision": "allow", "classification": "exact_match", "runtime_identity_changed": False, **common}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--baseline", required=True)
    parser.add_argument("--resumed", required=True)
    parser.add_argument("--config", required=True)
    args = parser.parse_args()
    try:
        cfg = load_json(args.config)
        baseline = load_json(args.baseline)
        resumed = load_json(args.resumed)
        code, result = analyze(baseline, resumed, cfg)
        print(json.dumps(result, sort_keys=True))
        return code
    except ValueError as exc:
        print(json.dumps({"decision": "block", "classification": "input_error", "error": str(exc)}, sort_keys=True))
        return 3


if __name__ == "__main__":
    sys.exit(main())

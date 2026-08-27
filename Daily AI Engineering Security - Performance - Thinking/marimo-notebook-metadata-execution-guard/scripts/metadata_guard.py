#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"read_error:{exc}"}))
        raise SystemExit(2)


def walk(obj, prefix=""):
    if isinstance(obj, dict):
        for key, value in obj.items():
            path = f"{prefix}.{key}" if prefix else str(key)
            yield path, value
            yield from walk(value, path)
    elif isinstance(obj, list):
        for index, value in enumerate(obj):
            path = f"{prefix}[{index}]"
            yield path, value
            yield from walk(value, path)


def evaluate(metadata, policy, trusted=False):
    encoded = json.dumps(metadata, separators=(",", ":")).encode("utf-8")
    reasons, risky_paths = [], []
    if len(encoded) > int(policy.get("max_metadata_bytes", 65536)):
        reasons.append("metadata_size_exceeded")
    safe = set(policy.get("safe_top_level_sections", []))
    markers = [str(x).casefold() for x in policy.get("side_effect_markers", [])]
    for path, _ in walk(metadata):
        lowered = path.casefold()
        top = path.split(".", 1)[0].split("[", 1)[0]
        if any(marker in lowered for marker in markers):
            risky_paths.append(path)
        if top not in safe:
            reasons.append(f"section_not_allowlisted:{top}")
    risky_paths = sorted(set(risky_paths))
    reasons = sorted(set(reasons))
    if trusted and policy.get("require_explicit_trust_for_risky_metadata", True):
        return {"ok": True, "decision": "allow_trusted", "risky_paths": risky_paths, "reasons": reasons}
    if risky_paths or reasons:
        return {"ok": False, "decision": "quarantine", "risky_paths": risky_paths, "reasons": reasons}
    return {"ok": True, "decision": "allow_data_only", "risky_paths": [], "reasons": []}


def main():
    parser = argparse.ArgumentParser(description="Pre-open notebook metadata trust gate")
    parser.add_argument("--metadata", required=True, help="JSON metadata file")
    parser.add_argument("--policy", required=True, help="JSON policy file")
    parser.add_argument("--trusted", action="store_true", help="explicit operator trust elevation")
    args = parser.parse_args()
    result = evaluate(load_json(args.metadata), load_json(args.policy), args.trusted)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())

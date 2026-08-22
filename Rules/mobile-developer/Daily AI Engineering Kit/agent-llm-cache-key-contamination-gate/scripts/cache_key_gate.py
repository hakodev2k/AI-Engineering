#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None


def stable_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def sha256_text(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def load_yaml(path):
    if yaml is None:
        raise RuntimeError("PyYAML is required: pip install pyyaml")
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def contains_sensitive(value, patterns):
    text = stable_json(value).lower()
    return sorted({p for p in patterns if p.lower() in text})


def build_key(req, policy):
    missing = []
    material = {}
    mapping = {
        "model": req.get("model"),
        "system_prompt_hash": sha256_text(req.get("system_prompt", "")),
        "user_prompt_hash": sha256_text(req.get("user_prompt", "")),
        "tool_schema_hash": sha256_text(stable_json(req.get("tool_schema"))),
        "temperature": req.get("temperature"),
        "response_format": req.get("response_format"),
        "tenant_id": req.get("tenant_id"),
        "user_id": req.get("user_id"),
        "data_scope": req.get("data_scope"),
    }
    for field in policy.get("key_fields", []):
        value = mapping.get(field)
        if value is None or value == "":
            missing.append(field)
        else:
            material[field] = value
    if policy.get("namespace_required", True):
        material["namespace"] = "llm-cache-v1"
    key = "llm:" + sha256_text(stable_json(material))
    return key, material, missing


def evaluate(req, policy):
    errors, warnings = [], []
    sensitive = contains_sensitive(req, policy.get("sensitive_data_patterns", []))
    if sensitive:
        warnings.append("Sensitive-looking field names detected: " + ", ".join(sensitive))

    key, material, missing = build_key(req, policy)
    if missing and policy.get("reject_missing_context_fields", True):
        errors.append("Missing cache-key context fields: " + ", ".join(missing))

    if not req.get("tenant_id"):
        errors.append("tenant_id is required to prevent cross-tenant cache reuse")
    if not req.get("data_scope"):
        errors.append("data_scope is required to bind cached output to its authorization/data boundary")

    ttl = int(req.get("requested_ttl_seconds", policy.get("max_ttl_seconds", 3600)))
    max_ttl = int(policy.get("max_ttl_seconds", 3600))
    if ttl > max_ttl:
        warnings.append(f"TTL clamped from {ttl}s to {max_ttl}s")
        ttl = max_ttl

    result = {
        "status": "BLOCK" if errors else "PASS",
        "cache_key": key if not errors else None,
        "ttl_seconds": ttl,
        "key_material": material,
        "errors": errors,
        "warnings": warnings,
    }
    return result


def main():
    p = argparse.ArgumentParser(description="Generate and validate an isolation-safe LLM cache key")
    p.add_argument("--request", required=True, help="JSON request file")
    p.add_argument("--policy", required=True, help="YAML policy file")
    p.add_argument("--output", help="Optional result JSON path")
    args = p.parse_args()

    try:
        req = json.loads(Path(args.request).read_text(encoding="utf-8"))
        policy = load_yaml(args.policy)
        result = evaluate(req, policy)
    except Exception as exc:
        print(json.dumps({"status": "ERROR", "error": str(exc)}, indent=2), file=sys.stderr)
        return 2

    text = json.dumps(result, indent=2, ensure_ascii=False)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    print(text)
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())

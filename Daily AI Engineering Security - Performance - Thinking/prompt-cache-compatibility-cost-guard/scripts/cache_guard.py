#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"status": "error", "reason": f"cannot_read:{path}:{exc}"}))
        raise SystemExit(2)


def evaluate(request, usage, policy):
    model = request.get("model")
    cache = request.get("cache", {})
    models = policy.get("models", {})
    behavior = policy.get("behavior", {})
    reasons, warnings = [], []

    if model not in models:
        reasons.append("unknown_model")
        return {"status": "block", "model": model, "reasons": reasons, "warnings": warnings}

    mp = models[model]
    allowed = set(mp.get("allowed_cache_fields", []))
    deprecated = set(mp.get("deprecated_cache_fields", []))

    for key in cache:
        if key in deprecated:
            reasons.append(f"deprecated_field:{key}")
        elif key not in allowed:
            reasons.append(f"unsupported_field:{key}")

    options = cache.get("prompt_cache_options")
    if options is not None:
        if not isinstance(options, dict):
            reasons.append("prompt_cache_options_not_object")
        else:
            ttl = options.get("ttl")
            if ttl is not None and ttl not in mp.get("allowed_ttls", []):
                reasons.append(f"unsupported_ttl:{ttl}")

    if "prompt_cache_breakpoint" in cache and not mp.get("allow_explicit_breakpoints", False):
        reasons.append("explicit_breakpoint_not_supported")

    input_tokens = int(usage.get("input_tokens", 0))
    read_tokens = int(usage.get("cache_read_tokens", 0))
    write_tokens = int(usage.get("cache_write_tokens", 0))
    econ = policy.get("economics", {})
    metrics = {
        "input_tokens": input_tokens,
        "cache_read_tokens": read_tokens,
        "cache_write_tokens": write_tokens,
        "cache_write_share_of_input": (write_tokens / input_tokens) if input_tokens else 0.0,
        "cache_write_to_read_ratio": (write_tokens / read_tokens) if read_tokens else (float("inf") if write_tokens else 0.0)
    }

    if input_tokens >= int(econ.get("min_observed_input_tokens", 0)):
        if metrics["cache_write_share_of_input"] > float(econ.get("max_cache_write_share_of_input", 1.0)):
            warnings.append("cache_write_share_exceeded")
        if metrics["cache_write_to_read_ratio"] > float(econ.get("max_cache_write_to_read_ratio", float("inf"))):
            warnings.append("cache_write_to_read_ratio_exceeded")

    if reasons:
        status = "block"
    elif warnings and behavior.get("economic_threshold_exceeded", "warn") == "block":
        status = "block"
    elif warnings:
        status = "warn"
    else:
        status = "pass"
    return {"status": status, "model": model, "reasons": sorted(set(reasons)), "warnings": sorted(set(warnings)), "metrics": metrics}


def main():
    p = argparse.ArgumentParser(description="Validate prompt-cache compatibility and economics.")
    p.add_argument("--request", required=True)
    p.add_argument("--usage", required=True)
    p.add_argument("--policy", required=True)
    args = p.parse_args()
    result = evaluate(load_json(args.request), load_json(args.usage), load_json(args.policy))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["status"] in {"pass", "warn"} else 3


if __name__ == "__main__":
    raise SystemExit(main())

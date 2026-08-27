#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path


def canonical_key(tool, args):
    payload = json.dumps(args, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return f"{tool}:{hashlib.sha256(payload.encode('utf-8')).hexdigest()}"


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def load_trace(path, max_lines):
    rows = []
    for number, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        if len(rows) >= max_lines:
            raise ValueError("trace_line_limit_exceeded")
        try:
            row = json.loads(line)
        except Exception as exc:
            raise ValueError(f"invalid_json_line:{number}:{exc}")
        required = {"timestamp_ms", "tool", "args", "latency_ms", "output_digest", "scope_id"}
        missing = required - row.keys()
        if missing:
            raise ValueError("missing_fields:" + ",".join(sorted(missing)))
        rows.append(row)
    return rows


def analyze(rows, policy):
    cacheable = policy.get("cacheable_tools", {})
    never = set(policy.get("never_cache_tools", []))
    seen = {}
    total_calls = 0
    duplicate_calls = 0
    avoidable_latency = 0
    unsafe_attempts = []
    duplicates = []

    for row in rows:
        total_calls += 1
        tool = row["tool"]
        if tool in never:
            continue
        if tool not in cacheable:
            continue
        cfg = cacheable[tool]
        ttl = int(cfg.get("ttl_ms", 0))
        declared_scope = cfg.get("scope", "run")
        if declared_scope != "run":
            unsafe_attempts.append({"tool": tool, "reason": "unsupported_scope_policy"})
            continue
        key = canonical_key(tool, row["args"])
        scope_key = (row["scope_id"], key)
        previous = seen.get(scope_key)
        if previous is not None:
            age = int(row["timestamp_ms"]) - int(previous["timestamp_ms"])
            same_output = row["output_digest"] == previous["output_digest"]
            if 0 <= age <= ttl and same_output:
                duplicate_calls += 1
                avoidable_latency += int(row["latency_ms"])
                duplicates.append({
                    "tool": tool,
                    "scope_id": row["scope_id"],
                    "age_ms": age,
                    "latency_ms": int(row["latency_ms"]),
                    "key": key,
                })
        seen[scope_key] = row

    duplicate_rate = (duplicate_calls / total_calls) if total_calls else 0.0
    thresholds = policy.get("thresholds", {})
    warnings = []
    if total_calls >= int(thresholds.get("min_calls_for_measurement", 0)):
        if duplicate_rate >= float(thresholds.get("duplicate_rate_warning", 1.0)):
            warnings.append("duplicate_rate_exceeded")
        if avoidable_latency >= int(thresholds.get("avoidable_latency_ms_warning", 2**63 - 1)):
            warnings.append("avoidable_latency_exceeded")
    return {
        "status": "warn" if warnings else "pass",
        "total_calls": total_calls,
        "duplicate_calls": duplicate_calls,
        "duplicate_rate": duplicate_rate,
        "avoidable_latency_ms": avoidable_latency,
        "warnings": warnings,
        "unsafe_policy_findings": unsafe_attempts,
        "duplicates": duplicates,
    }


def main():
    p = argparse.ArgumentParser(description="Profile safely reusable read-only tool calls.")
    p.add_argument("--trace", required=True)
    p.add_argument("--policy", required=True)
    args = p.parse_args()
    try:
        policy = load_json(args.policy)
        rows = load_trace(args.trace, int(policy.get("max_trace_lines", 100000)))
        result = analyze(rows, policy)
    except Exception as exc:
        print(json.dumps({"status": "error", "reason": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
import argparse, json, re, sys
from datetime import datetime, timezone

SHA256_RE = re.compile(r"^[a-f0-9]{64}$")
REQUIRED = ["result_id","source","tool_name","query_fingerprint","result_fingerprint","observed_at","volatility","policy_id","invalidation_signals","dependent_decisions"]
SENSITIVE_KEYS = {"password","secret","token","authorization","connection_string","connectionstring","api_key","apikey"}


def fail(msg):
    print(json.dumps({"status":"invalid","error":msg}))
    return 2


def walk_sensitive(obj, path="$"):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k.lower() in SENSITIVE_KEYS:
                return f"sensitive key present at {path}.{k}"
            found = walk_sensitive(v, f"{path}.{k}")
            if found: return found
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            found = walk_sensitive(v, f"{path}[{i}]")
            if found: return found
    return None


def main():
    p=argparse.ArgumentParser()
    p.add_argument("record")
    p.add_argument("--max-clock-skew-seconds", type=int, default=120)
    a=p.parse_args()
    try:
        data=json.load(open(a.record, encoding="utf-8"))
    except Exception as e:
        return fail(f"cannot read JSON: {e}")
    for key in REQUIRED:
        if key not in data: return fail(f"missing field: {key}")
    if not isinstance(data["source"], dict): return fail("source must be object")
    for key in ["kind","identity","revision"]:
        if not str(data["source"].get(key,"")): return fail(f"source.{key} required")
    for key in ["query_fingerprint","result_fingerprint"]:
        if not SHA256_RE.match(str(data[key])): return fail(f"{key} must be lowercase SHA-256")
    if data["volatility"] not in {"low","medium","high","event-driven"}: return fail("invalid volatility")
    if not isinstance(data["invalidation_signals"], list): return fail("invalidation_signals must be array")
    if not isinstance(data["dependent_decisions"], list) or not data["dependent_decisions"]: return fail("dependent_decisions must be non-empty array")
    try:
        ts=datetime.fromisoformat(data["observed_at"].replace("Z","+00:00"))
        if ts.tzinfo is None: return fail("observed_at must include timezone")
    except Exception:
        return fail("observed_at must be ISO-8601 date-time")
    now=datetime.now(timezone.utc)
    if (ts-now).total_seconds() > a.max_clock_skew_seconds: return fail("observed_at is too far in the future")
    sensitive=walk_sensitive(data)
    if sensitive: return fail(sensitive)
    print(json.dumps({"status":"valid","result_id":data["result_id"]}))
    return 0

if __name__ == "__main__": sys.exit(main())

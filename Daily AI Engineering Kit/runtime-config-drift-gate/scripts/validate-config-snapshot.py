#!/usr/bin/env python3
import argparse, json, re, sys
from datetime import datetime, timezone

VALID_CLASSES = {"public", "sensitive", "secret"}
VALID_KINDS = {"expected", "runtime"}
VALID_TYPES = {"string", "number", "boolean", "array", "object", "null", "unknown"}

def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def parse_dt(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--snapshot", required=True)
    p.add_argument("--policy", required=True)
    args = p.parse_args()
    try:
        snap, policy = load(args.snapshot), load(args.policy)
    except Exception as e:
        print(f"ERROR: unable to load JSON: {e}", file=sys.stderr); return 2
    errors=[]
    for field in ["application","environment","snapshot_kind","producer","generated_at","sources","entries"]:
        if field not in snap: errors.append(f"missing top-level field: {field}")
    if snap.get("snapshot_kind") not in VALID_KINDS: errors.append("invalid snapshot_kind")
    try:
        dt=parse_dt(snap.get("generated_at", ""))
        if dt.tzinfo is None: errors.append("generated_at must include timezone")
    except Exception: errors.append("generated_at must be ISO-8601")
    if not isinstance(snap.get("sources"), list) or not snap.get("sources"): errors.append("sources must be a non-empty array")
    entries=snap.get("entries")
    if not isinstance(entries,list): errors.append("entries must be an array"); entries=[]
    seen=set(); secret_patterns=[re.compile(x,re.I) for x in policy.get("secret_name_patterns",[])]
    for i,e in enumerate(entries):
        prefix=f"entries[{i}]"
        if not isinstance(e,dict): errors.append(f"{prefix} must be object"); continue
        for field in ["key","classification","required","present","source","value_type"]:
            if field not in e: errors.append(f"{prefix} missing {field}")
        key=e.get("key")
        if not isinstance(key,str) or not key: errors.append(f"{prefix}.key invalid")
        elif key in seen: errors.append(f"duplicate key: {key}")
        else: seen.add(key)
        cls=e.get("classification")
        if cls not in VALID_CLASSES: errors.append(f"{prefix}.classification invalid")
        if e.get("value_type") not in VALID_TYPES: errors.append(f"{prefix}.value_type invalid")
        if not isinstance(e.get("required"),bool): errors.append(f"{prefix}.required must be boolean")
        if not isinstance(e.get("present"),bool): errors.append(f"{prefix}.present must be boolean")
        looks_secret=isinstance(key,str) and any(r.search(key) for r in secret_patterns)
        if looks_secret and cls != "secret": errors.append(f"{prefix} key matches secret pattern but classification is {cls}")
        if cls == "secret" and "value" in e: errors.append(f"{prefix} secret entry must not contain value")
        if not e.get("present") and "value" in e: errors.append(f"{prefix} absent entry must not contain value")
        if e.get("required") and snap.get("snapshot_kind")=="expected" and not e.get("source"):
            errors.append(f"{prefix} required expected key must declare source")
    if errors:
        print(json.dumps({"status":"invalid","errors":errors}, indent=2)); return 1
    print(json.dumps({"status":"valid","entry_count":len(entries)}, indent=2)); return 0

if __name__ == "__main__":
    raise SystemExit(main())

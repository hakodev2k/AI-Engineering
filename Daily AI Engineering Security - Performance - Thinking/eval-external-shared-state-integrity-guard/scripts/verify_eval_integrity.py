#!/usr/bin/env python3
"""Deterministically verify evaluation external-state integrity from JSONL events.

Event schema per line:
{"run_id":"r1","operation":"read|write","destination":"https://example","object_key":"optional","policy":"allowed|shared|evaluator","owner_run_id":"optional"}
Exit codes: 0 verified, 2 integrity violation, 3 input/usage error.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

REQUIRED = {"run_id", "operation", "destination", "policy"}


def load_allowed(path: Path) -> set[str]:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read policy: {e}")
    vals = obj.get("allowed_destinations")
    if not isinstance(vals, list) or not all(isinstance(x, str) for x in vals):
        raise ValueError("policy must contain string list allowed_destinations")
    return set(vals)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--events", required=True, type=Path)
    p.add_argument("--policy", required=True, type=Path)
    p.add_argument("--run-id", required=True)
    p.add_argument("--allow-collaboration", action="store_true")
    args = p.parse_args()
    try:
        allowed = load_allowed(args.policy)
        lines = args.events.read_text(encoding="utf-8").splitlines()
    except Exception as e:
        print(json.dumps({"status":"error","error":str(e)}))
        return 3
    violations = []
    if not lines:
        print(json.dumps({"status":"error","error":"empty telemetry"}))
        return 3
    for n, line in enumerate(lines, 1):
        try:
            ev = json.loads(line)
        except json.JSONDecodeError as e:
            print(json.dumps({"status":"error","error":f"line {n}: {e}"}))
            return 3
        missing = REQUIRED - ev.keys()
        if missing:
            print(json.dumps({"status":"error","error":f"line {n}: missing {sorted(missing)}"}))
            return 3
        if ev["run_id"] != args.run_id:
            violations.append({"line":n,"type":"wrong-run-id","value":ev["run_id"]})
        if ev["operation"] not in {"read","write"}:
            print(json.dumps({"status":"error","error":f"line {n}: invalid operation"}))
            return 3
        if ev["policy"] == "evaluator":
            violations.append({"line":n,"type":"evaluator-resource-access","destination":ev["destination"]})
        if ev["destination"] not in allowed:
            violations.append({"line":n,"type":"undeclared-destination","destination":ev["destination"]})
        owner = ev.get("owner_run_id")
        if (not args.allow_collaboration and ev["operation"] == "read" and owner and owner != args.run_id):
            violations.append({"line":n,"type":"cross-run-read","owner_run_id":owner,"destination":ev["destination"],"object_key":ev.get("object_key")})
        if ev["operation"] == "write" and ev["policy"] == "shared" and not args.allow_collaboration:
            violations.append({"line":n,"type":"undeclared-shared-write","destination":ev["destination"],"object_key":ev.get("object_key")})
    out = {"status":"rejected" if violations else "verified","run_id":args.run_id,"events":len(lines),"violations":violations}
    print(json.dumps(out, indent=2, sort_keys=True))
    return 2 if violations else 0

if __name__ == "__main__":
    sys.exit(main())

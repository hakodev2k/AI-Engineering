#!/usr/bin/env python3
import json, sys

REQ = {"name","owner","source_of_truth","classification","freshness","fields","compatibility"}
CLASS = {"public","internal","confidential","restricted"}
COMPAT = {"backward","forward","full","none"}

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr); raise SystemExit(code)

if len(sys.argv) != 2: fail("usage: validate-data-contract.py <contract.json>", 2)
try:
    data=json.load(open(sys.argv[1], encoding="utf-8"))
except Exception as e: fail(f"cannot parse JSON: {e}", 2)
missing=REQ-set(data)
if missing: fail("missing required keys: "+", ".join(sorted(missing)))
if data["classification"] not in CLASS: fail("invalid classification")
if data["compatibility"] not in COMPAT: fail("invalid compatibility")
if not isinstance(data["fields"], list) or not data["fields"]: fail("fields must be non-empty list")
names=[]
for i,f in enumerate(data["fields"]):
    for k in ("name","type","nullable","description"):
        if k not in f: fail(f"fields[{i}] missing {k}")
    if not isinstance(f["nullable"], bool): fail(f"fields[{i}].nullable must be boolean")
    names.append(f["name"])
if len(names)!=len(set(names)): fail("duplicate field names")
for k in ("name","owner","source_of_truth","freshness"):
    if not isinstance(data[k], str) or not data[k].strip(): fail(f"{k} must be non-empty string")
print("OK: data contract is structurally valid")

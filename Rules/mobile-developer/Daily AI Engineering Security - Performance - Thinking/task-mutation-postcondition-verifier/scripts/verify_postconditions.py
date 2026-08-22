#!/usr/bin/env python3
"""Verify declarative postconditions over metadata snapshots.
Exit: 0 verified-success, 2 verified-failure, 3 invalid input, 4 indeterminate.
Expectation format: {"required": [{"path":"status","op":"eq","value":"archived"}, ...]}.
Supported ops: eq, ne, exists, absent.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load(path: str) -> dict:
    obj = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(obj, dict): raise ValueError(f"{path}: root must be object")
    return obj


def get(obj, dotted):
    cur = obj
    for part in dotted.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return False, None
        cur = cur[part]
    return True, cur


def check(post, rule):
    path, op = rule.get("path"), rule.get("op")
    if not path or op not in {"eq","ne","exists","absent"}:
        raise ValueError("invalid rule")
    found, value = get(post, path)
    if op == "exists": return True if found else None
    if op == "absent": return True if not found else False
    if not found: return None
    target = rule.get("value")
    return (value == target) if op == "eq" else (value != target)


def main():
    p=argparse.ArgumentParser(); p.add_argument("--pre",required=True); p.add_argument("--post",required=True); p.add_argument("--expect",required=True); a=p.parse_args()
    try:
        pre, post, expect = load(a.pre), load(a.post), load(a.expect)
        required = expect.get("required")
        if not isinstance(required,list) or not required: raise ValueError("expect.required must be non-empty list")
        if pre.get("resource_id") and post.get("resource_id") and pre["resource_id"] != post["resource_id"]:
            print(json.dumps({"status":"indeterminate","reason":"resource_id mismatch"})); return 4
        results=[]
        for rule in required:
            result=check(post,rule); results.append({"path":rule.get("path"),"result":result})
        if any(r["result"] is False for r in results): status,code="verified-failure",2
        elif any(r["result"] is None for r in results): status,code="indeterminate",4
        else: status,code="verified-success",0
        print(json.dumps({"status":status,"checks":results},sort_keys=True)); return code
    except (OSError,json.JSONDecodeError,ValueError) as e:
        print(json.dumps({"status":"invalid","reason":str(e)},sort_keys=True)); return 3

if __name__ == "__main__": sys.exit(main())

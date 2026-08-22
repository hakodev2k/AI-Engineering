#!/usr/bin/env python3
"""Canonicalize MCP tool descriptors and bind human approval to model/call bytes."""
from __future__ import annotations
import argparse, hashlib, json, sys, unicodedata
from pathlib import Path

TAG_START, TAG_END = 0xE0000, 0xE007F
BIDI = {0x061C, 0x200E, 0x200F, *range(0x202A, 0x202F), *range(0x2066, 0x206A)}
ZERO_WIDTH = {0x200B, 0x200C, 0x200D, 0x2060, 0xFEFF}
FIELDS = ("name", "title", "description", "inputSchema", "outputSchema", "annotations")


def walk_strings(value, path="$", out=None):
    out = [] if out is None else out
    if isinstance(value, str): out.append((path, value))
    elif isinstance(value, dict):
        for k, v in value.items(): walk_strings(v, f"{path}.{k}", out)
    elif isinstance(value, list):
        for i, v in enumerate(value): walk_strings(v, f"{path}[{i}]", out)
    return out


def dangerous(text):
    hits=[]
    for i,ch in enumerate(text):
        cp=ord(ch); cat=unicodedata.category(ch)
        if TAG_START <= cp <= TAG_END: hits.append((i, cp, "TAG_BLOCK"))
        elif cp in BIDI: hits.append((i, cp, "BIDI_CONTROL"))
        elif cp in ZERO_WIDTH: hits.append((i, cp, "ZERO_WIDTH"))
        elif cat in {"Cc","Cf"} and ch not in "\t\n\r": hits.append((i, cp, "CONTROL_FORMAT"))
    return hits


def security_descriptor(tool):
    return {k: tool[k] for k in FIELDS if k in tool}


def canonical_bytes(tool):
    obj=security_descriptor(tool)
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def digest(tool): return hashlib.sha256(canonical_bytes(tool)).hexdigest()


def validate(tool):
    findings=[]
    for path,text in walk_strings(security_descriptor(tool)):
        for idx,cp,reason in dangerous(text):
            findings.append({"path":path,"index":idx,"codepoint":f"U+{cp:04X}","reason":reason})
    return findings


def load(path): return json.loads(Path(path).read_text(encoding="utf-8"))


def main():
    p=argparse.ArgumentParser()
    sub=p.add_subparsers(dest="cmd",required=True)
    c=sub.add_parser("check"); c.add_argument("descriptor")
    a=sub.add_parser("approve"); a.add_argument("descriptor"); a.add_argument("--server",required=True); a.add_argument("--out",required=True); a.add_argument("--policy-version",default="2026-08-20.1")
    v=sub.add_parser("verify"); v.add_argument("descriptor"); v.add_argument("approval"); v.add_argument("--server",required=True); v.add_argument("--policy-version",default="2026-08-20.1")
    args=p.parse_args(); tool=load(args.descriptor); findings=validate(tool)
    if findings:
        print(json.dumps({"ok":False,"reason":"UNREVIEWABLE_UNICODE","findings":findings},ensure_ascii=False,indent=2)); return 2
    d=digest(tool)
    if args.cmd=="check": print(json.dumps({"ok":True,"digest":d},indent=2)); return 0
    if args.cmd=="approve":
        record={"server":args.server,"tool":tool.get("name"),"descriptorSha256":d,"policyVersion":args.policy_version}
        Path(args.out).write_text(json.dumps(record,indent=2)+"\n",encoding="utf-8")
        print(json.dumps({"ok":True,"approval":args.out,"digest":d},indent=2)); return 0
    record=load(args.approval)
    checks={"server":record.get("server")==args.server,"tool":record.get("tool")==tool.get("name"),"digest":record.get("descriptorSha256")==d,"policyVersion":record.get("policyVersion")==args.policy_version}
    ok=all(checks.values())
    print(json.dumps({"ok":ok,"reason":"APPROVAL_MATCH" if ok else "REAPPROVAL_REQUIRED","checks":checks,"digest":d},indent=2)); return 0 if ok else 3

if __name__=="__main__": sys.exit(main())

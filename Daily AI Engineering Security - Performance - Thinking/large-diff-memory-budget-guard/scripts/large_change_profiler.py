#!/usr/bin/env python3
"""Profile large repository files and JSONL history records without loading them fully.

Modes:
  --repo PATH   scan regular files for size threshold
  --jsonl PATH  scan line/record sizes in a JSONL file using binary iteration

Exit codes: 0=no blocking findings, 2=threshold exceeded, 64=input error.
"""
from __future__ import annotations
import argparse, json, os, sys
from pathlib import Path

SKIP_DIRS = {".git", ".hg", ".svn", "node_modules", ".venv", "venv"}

def args():
    p = argparse.ArgumentParser()
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--repo", type=Path)
    g.add_argument("--jsonl", type=Path)
    p.add_argument("--max-file-bytes", type=int, default=5_000_000)
    p.add_argument("--max-record-bytes", type=int, default=2_000_000)
    p.add_argument("--top", type=int, default=20)
    return p.parse_args()

def die(msg):
    print(json.dumps({"error": msg}), file=sys.stderr)
    raise SystemExit(64)

def scan_repo(root, limit, top):
    if not root.is_dir(): die(f"not a directory: {root}")
    findings=[]; total=0; count=0
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            p=Path(base)/name
            try:
                if p.is_symlink() or not p.is_file(): continue
                size=p.stat().st_size
            except OSError:
                continue
            count += 1; total += size
            if size > limit:
                findings.append({"path":str(p.relative_to(root)),"bytes":size,"reason":"file_size_budget"})
    findings.sort(key=lambda x:x["bytes"], reverse=True)
    return {"mode":"repo","files_scanned":count,"total_bytes":total,"limit":limit,"findings":findings[:top],"oversize_count":len(findings)}

def scan_jsonl(path, limit, top):
    if not path.is_file(): die(f"not a file: {path}")
    findings=[]; total=0; count=0; maxb=0
    with path.open("rb") as f:
        for n,line in enumerate(f,1):
            size=len(line); count+=1; total+=size; maxb=max(maxb,size)
            if size > limit:
                findings.append({"line":n,"bytes":size,"reason":"history_record_budget"})
    findings.sort(key=lambda x:x["bytes"], reverse=True)
    return {"mode":"jsonl","records_scanned":count,"total_bytes":total,"max_record_bytes":maxb,"limit":limit,"findings":findings[:top],"oversize_count":len(findings)}

def main():
    a=args()
    if min(a.max_file_bytes,a.max_record_bytes,a.top) < 1: die("limits and --top must be >= 1")
    out=scan_repo(a.repo,a.max_file_bytes,a.top) if a.repo else scan_jsonl(a.jsonl,a.max_record_bytes,a.top)
    print(json.dumps(out,indent=2,sort_keys=True))
    return 2 if out["oversize_count"] else 0
if __name__ == "__main__": raise SystemExit(main())

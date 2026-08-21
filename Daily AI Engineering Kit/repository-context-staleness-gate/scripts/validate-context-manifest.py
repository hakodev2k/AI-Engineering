#!/usr/bin/env python3
import json, sys
from pathlib import Path

def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr); sys.exit(2)

def main():
    if len(sys.argv) != 2: fail("usage: validate-context-manifest.py <manifest.json>")
    p = Path(sys.argv[1])
    if not p.is_file(): fail("manifest not found")
    try: data = json.loads(p.read_text(encoding="utf-8"))
    except Exception as e: fail(f"invalid json: {e}")
    for k in ("repository","revision","scope","artifacts"):
        if k not in data: fail(f"missing field: {k}")
    if not isinstance(data["scope"], list) or not data["scope"]: fail("scope must be non-empty list")
    if not isinstance(data["artifacts"], list) or not data["artifacts"]: fail("artifacts must be non-empty list")
    seen=set()
    for a in data["artifacts"]:
        aid=a.get("id")
        if not aid or aid in seen: fail("artifact ids must be unique and non-empty")
        seen.add(aid)
        if a.get("type") not in {"source","summary","repository-map","index-hit","agent-note"}: fail(f"invalid type for {aid}")
        sources=a.get("sources")
        if not isinstance(sources,list) or not sources: fail(f"artifact {aid} requires sources")
        for s in sources:
            path=s.get("path","")
            sha=s.get("sha256","")
            if not path or Path(path).is_absolute() or ".." in Path(path).parts: fail(f"unsafe source path in {aid}")
            if len(sha)!=64 or any(c not in "0123456789abcdefABCDEF" for c in sha): fail(f"invalid sha256 for {aid}:{path}")
    print("valid")

if __name__ == "__main__": main()

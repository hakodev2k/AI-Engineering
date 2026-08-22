#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

PATTERNS = [
    ("unbounded-body-read", re.compile(r"ReadToEndAsync\s*\(|ReadAsByteArrayAsync\s*\(|\.Body\.CopyToAsync\s*\(", re.I)),
    ("buffer-entire-body", re.compile(r"EnableBuffering\s*\(|MemoryStream\s*\(", re.I)),
    ("multipart-upload", re.compile(r"IFormFile|Multipart|FormFile", re.I)),
    ("explicit-large-limit", re.compile(r"RequestSizeLimit\s*\(\s*(\d+)|MaxRequestBodySize\s*=\s*(\d+)", re.I)),
    ("disabled-limit", re.compile(r"DisableRequestSizeLimit|MaxRequestBodySize\s*=\s*null", re.I)),
]
EXTS = {".cs", ".fs", ".vb", ".js", ".ts", ".tsx", ".jsx", ".py", ".go", ".java", ".kt", ".rb", ".php", ".json", ".yaml", ".yml", ".toml", ".conf"}
SKIP = {".git", "node_modules", "bin", "obj", "dist", "build", "vendor"}

def scan(root: Path):
    findings=[]
    for p in root.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in EXTS or any(x in SKIP for x in p.parts):
            continue
        try: text=p.read_text(encoding="utf-8", errors="ignore")
        except OSError: continue
        for lineno,line in enumerate(text.splitlines(),1):
            for kind,rx in PATTERNS:
                if rx.search(line):
                    findings.append({"kind":kind,"path":str(p.relative_to(root)),"line":lineno,"snippet":line.strip()[:240]})
    return findings

def main():
    ap=argparse.ArgumentParser(description="Heuristically scan for request-body size and buffering risk.")
    ap.add_argument("root")
    ap.add_argument("--output")
    args=ap.parse_args()
    root=Path(args.root).resolve()
    if not root.is_dir():
        print("root must be a directory", file=sys.stderr); return 2
    findings=scan(root)
    payload={"root":str(root),"finding_count":len(findings),"findings":findings,"advisory":True}
    out=json.dumps(payload,indent=2)
    if args.output: Path(args.output).write_text(out+"\n",encoding="utf-8")
    else: print(out)
    return 1 if findings else 0

if __name__=="__main__": raise SystemExit(main())

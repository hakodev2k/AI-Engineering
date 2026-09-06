#!/usr/bin/env python3
"""Detect risky invisible Unicode and optionally emit canonical text.
Exit 0 clean, 2 risky content detected, 3 input/config error.
"""
from __future__ import annotations
import argparse, hashlib, json, sys, unicodedata
from pathlib import Path

RISKY_SINGLE = {0x200B, 0x200C, 0x200D, 0x2060, 0x2062, 0x2063, 0x2064, 0xFEFF}

def risky(cp: int) -> bool:
    return 0xE0000 <= cp <= 0xE007F or cp in RISKY_SINGLE

def sha(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def escaped(text: str) -> str:
    out=[]
    for ch in text:
        cp=ord(ch)
        if risky(cp):
            out.append(f"<U+{cp:04X}:{unicodedata.name(ch, 'UNKNOWN')}>")
        else:
            out.append(ch)
    return "".join(out)

def main() -> int:
    p=argparse.ArgumentParser()
    p.add_argument("path", type=Path)
    p.add_argument("--strip-risky", action="store_true", help="emit canonical text with configured risky chars removed")
    p.add_argument("--output", type=Path)
    args=p.parse_args()
    try:
        raw=args.path.read_text(encoding="utf-8")
    except Exception as e:
        print(json.dumps({"status":"error","error":str(e)}))
        return 3
    findings=[]
    for i,ch in enumerate(raw):
        cp=ord(ch)
        if risky(cp):
            findings.append({"index":i,"codepoint":f"U+{cp:04X}","name":unicodedata.name(ch,"UNKNOWN")})
    canonical="".join(ch for ch in raw if not risky(ord(ch))) if args.strip_risky else raw
    if args.output:
        try:
            args.output.write_text(canonical, encoding="utf-8")
        except Exception as e:
            print(json.dumps({"status":"error","error":str(e)}))
            return 3
    report={"status":"risky" if findings else "clean","raw_sha256":sha(raw),"canonical_sha256":sha(canonical),"findings":findings,"escaped":escaped(raw)}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 2 if findings else 0

if __name__ == "__main__":
    sys.exit(main())

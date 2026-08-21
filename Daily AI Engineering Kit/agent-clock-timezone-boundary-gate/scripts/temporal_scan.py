#!/usr/bin/env python3
import argparse, json, os, re, sys
from pathlib import Path

PATTERNS = {
    "wall_clock": re.compile(r"\b(DateTime\.(Now|Today)|datetime\.now\s*\(|new\s+Date\s*\(|Date\.now\s*\()"),
    "utc_clock": re.compile(r"\b(DateTime\.UtcNow|DateTimeOffset\.UtcNow|datetime\.utcnow\s*\()"),
    "timezone_conversion": re.compile(r"\b(TimeZoneInfo|ZoneInfo|pytz|timezone|TimeZone|toLocaleString|toISOString)\b", re.I),
    "temporal_type": re.compile(r"\b(DateTimeOffset|DateTime|DateOnly|TimeOnly|Instant|LocalDate|datetime|timestamp)\b", re.I),
    "scheduler": re.compile(r"\b(cron|TimerTrigger|schedule|scheduled|expires?|expiry|ttl)\b", re.I),
}
EXTS={".cs",".fs",".vb",".py",".js",".ts",".tsx",".jsx",".java",".kt",".go",".rs",".sql",".yml",".yaml",".json",".toml"}
SKIP={".git","node_modules","bin","obj","dist","build",".venv","venv","vendor"}

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--root", default=".")
    p.add_argument("--output", default=".ai-temporal/scan.json")
    a=p.parse_args()
    root=Path(a.root).resolve()
    if not root.is_dir():
        print("root is not a directory", file=sys.stderr); return 2
    findings=[]
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in EXTS or any(x in SKIP for x in path.parts): continue
        try: lines=path.read_text(encoding="utf-8", errors="replace").splitlines()
        except OSError: continue
        for n,line in enumerate(lines,1):
            for kind,rx in PATTERNS.items():
                if rx.search(line):
                    findings.append({"kind":kind,"path":str(path.relative_to(root)),"line":n,"excerpt":line.strip()[:240]})
    out=Path(a.output); out.parent.mkdir(parents=True, exist_ok=True)
    payload={"root":str(root),"finding_count":len(findings),"findings":findings}
    out.write_text(json.dumps(payload,indent=2),encoding="utf-8")
    print(f"temporal scan: {len(findings)} candidates -> {out}")
    return 0
if __name__=="__main__": raise SystemExit(main())

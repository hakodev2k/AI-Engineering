#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

PATTERNS = [
    re.compile(r'FeatureFlag|feature[_-]?flag|IsEnabled\s*\(|GetVariation\s*\(', re.I),
    re.compile(r'LaunchDarkly|Unleash|ConfigCat|Microsoft\.FeatureManagement', re.I)
]
SKIP={'.git','node_modules','bin','obj','.venv','dist','build'}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('root', nargs='?', default='.')
    ap.add_argument('--json-out')
    args=ap.parse_args()
    root=Path(args.root)
    findings=[]
    for p in root.rglob('*'):
        if not p.is_file() or any(part in SKIP for part in p.parts): continue
        if p.suffix.lower() not in {'.cs','.ts','.tsx','.js','.jsx','.py','.java','.kt','.go','.json','.yaml','.yml'}: continue
        try: lines=p.read_text(encoding='utf-8',errors='ignore').splitlines()
        except Exception: continue
        for n,line in enumerate(lines,1):
            if any(rx.search(line) for rx in PATTERNS):
                findings.append({'path':str(p),'line':n,'text':line.strip()[:300]})
    payload={'count':len(findings),'findings':findings}
    if args.json_out: Path(args.json_out).write_text(json.dumps(payload,indent=2),encoding='utf-8')
    else: print(json.dumps(payload,indent=2))
    return 0

if __name__=='__main__': sys.exit(main())

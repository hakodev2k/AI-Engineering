#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

SEV = {"low": 1, "medium": 2, "high": 3}

def parse_yaml_subset(path: Path):
    # Minimal parser for this kit's simple YAML structure; avoids external deps.
    text = path.read_text(encoding="utf-8").splitlines()
    cfg = {"source_extensions": [], "risky_patterns": [], "suppressions": []}
    section = None; current = None
    for raw in text:
        line = raw.strip()
        if not line or line.startswith("#"): continue
        if line.endswith(":") and not line.startswith("-"):
            section = line[:-1]; continue
        if line.startswith("-"):
            value = line[1:].strip()
            if section == "source_extensions": cfg[section].append(value)
            elif section == "suppressions": cfg[section].append(value.strip('"'))
            elif section == "risky_patterns":
                current = {}
                cfg[section].append(current)
                if value.startswith("pattern:"): current["pattern"] = value.split(":",1)[1].strip().strip('"')
            continue
        if current is not None and section == "risky_patterns" and ":" in line:
            k,v=line.split(":",1); current[k.strip()] = v.strip().strip('"')
        elif ":" in line:
            k,v=line.split(":",1); cfg[k.strip()] = v.strip().strip('"')
    return cfg

def scan(root: Path, cfg):
    exts=set(cfg.get("source_extensions", [])); suppressions=set(cfg.get("suppressions", []))
    findings=[]; count=0
    for p in root.rglob("*"):
        if not p.is_file() or p.suffix not in exts: continue
        rel=p.relative_to(root).as_posix()
        if any(rel.startswith(x.rstrip("/")+"/") or rel==x for x in [".git","node_modules","bin","obj","dist","build"]): continue
        count += 1
        try: lines=p.read_text(encoding="utf-8", errors="ignore").splitlines()
        except OSError: continue
        for no,text in enumerate(lines,1):
            for rule in cfg.get("risky_patterns", []):
                pat=rule.get("pattern","")
                key=f"{rel}:{no}:{pat}"
                if pat and pat in text and key not in suppressions:
                    findings.append({"path":rel,"line":no,"severity":rule.get("severity","medium"),"pattern":pat,"reason":rule.get("reason","review cancellation semantics")})
    threshold=SEV.get(cfg.get("blocking_severity","high"),3)
    blocking=sum(SEV.get(f["severity"],2)>=threshold for f in findings)
    return {"status":"failed" if blocking else "passed","root":str(root.resolve()),"findings":findings,"summary":{"files_scanned":count,"finding_count":len(findings),"blocking_count":blocking}}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",default="."); ap.add_argument("--config",required=True); ap.add_argument("--out",default="cancellation-report.json")
    a=ap.parse_args(); root=Path(a.root); config=Path(a.config)
    if not root.exists() or not root.is_dir(): print("invalid root",file=sys.stderr); return 2
    if not config.is_file(): print("missing config",file=sys.stderr); return 2
    report=scan(root,parse_yaml_subset(config)); Path(a.out).write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(json.dumps(report["summary"])); return 1 if report["status"]=="failed" else 0
if __name__=="__main__": raise SystemExit(main())

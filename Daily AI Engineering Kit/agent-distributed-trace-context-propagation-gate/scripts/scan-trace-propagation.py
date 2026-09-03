#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

MANUAL_HEADER = re.compile(r"(?:traceparent|tracestate)\s*['\"]?\s*[:=]", re.I)
ROOT_START = re.compile(r"(?:StartActivity|start_span|start_as_current_span|StartSpan)\s*\(", re.I)


def load_config(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def source_files(repo: Path, cfg):
    roots = [repo / r for r in cfg["source_roots"] if (repo / r).exists()]
    if not roots: roots = [repo]
    excluded = set(cfg["exclude_dirs"])
    exts = set(cfg["extensions"])
    for root in roots:
        for path in root.rglob("*"):
            if not path.is_file() or path.suffix not in exts: continue
            rel = path.relative_to(repo)
            if any(part in excluded for part in rel.parts): continue
            yield path


def analyze_text(rel: str, text: str, cfg):
    findings = []
    boundaries = [p for p in cfg["boundary_patterns"] if p.lower() in text.lower()]
    propagation = [p for p in cfg["propagation_patterns"] if p.lower() in text.lower()]
    if boundaries and not propagation:
        findings.append({"severity":"high","path":rel,"rule":"boundary-without-propagation-signal","evidence":boundaries[:5],"message":"Process/network boundary found without a recognizable trace propagation signal; inspect this boundary."})
    if MANUAL_HEADER.search(text):
        findings.append({"severity":"medium","path":rel,"rule":"manual-trace-header-handling","evidence":["traceparent/tracestate assignment"],"message":"Manual trace-header handling detected; verify standards-compliant parsing/injection and trust boundaries."})
    if ROOT_START.search(text) and any(x.lower() in text.lower() for x in ["consume", "handler", "worker", "queue", "message"]):
        if not any(x.lower() in text.lower() for x in ["extract", "parent", "activitycontext", "spancontext"]):
            findings.append({"severity":"high","path":rel,"rule":"consumer-root-span-risk","evidence":["span/activity start in async consumer-like code"],"message":"Consumer/worker appears to start span work without visible extracted/parent context."})
    return findings


def scan(repo: Path, cfg):
    findings=[]; scanned=0
    for path in source_files(repo, cfg):
        try: text=path.read_text(encoding="utf-8", errors="ignore")
        except OSError: continue
        scanned += 1
        findings.extend(analyze_text(str(path.relative_to(repo)), text, cfg))
    high = sum(1 for f in findings if f["severity"] == "high")
    return {"scanned_files": scanned, "high_findings": high, "findings": findings}


def main() -> int:
    p=argparse.ArgumentParser()
    p.add_argument("--repo", required=True); p.add_argument("--config", required=True); p.add_argument("--output", required=True)
    a=p.parse_args(); repo=Path(a.repo).resolve(); cfgp=Path(a.config).resolve(); out=Path(a.output).resolve()
    if not repo.is_dir() or not cfgp.is_file(): print("repository/config missing", file=sys.stderr); return 2
    try: cfg=load_config(cfgp); result=scan(repo,cfg)
    except Exception as exc: print(f"scan failed: {exc}", file=sys.stderr); return 2
    out.parent.mkdir(parents=True, exist_ok=True); out.write_text(json.dumps(result, indent=2)+"\n", encoding="utf-8")
    print(json.dumps({"scanned_files":result["scanned_files"],"high_findings":result["high_findings"],"output":str(out)}))
    return 1 if result["high_findings"] > cfg["max_high_findings"] else 0

if __name__ == "__main__": raise SystemExit(main())

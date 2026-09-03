#!/usr/bin/env python3
import argparse, json, pathlib, re, sys

def load(path): return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
def contains(text, terms):
    low = text.lower(); return any(t.lower() in low for t in terms)

def main():
    p=argparse.ArgumentParser(); p.add_argument("--repo", required=True); p.add_argument("--config", required=True); p.add_argument("--output", required=True); a=p.parse_args()
    repo=pathlib.Path(a.repo).resolve(); cfg=load(a.config)
    if not repo.is_dir(): print("repository not found", file=sys.stderr); return 2
    findings=[]; scanned=0
    roots=[repo/r for r in cfg["source_roots"] if (repo/r).exists()] or [repo]
    excluded=set(cfg["exclude_dirs"]); exts=set(cfg["extensions"])
    for root in roots:
        for path in root.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in exts or any(part in excluded for part in path.parts): continue
            try: text=path.read_text(encoding="utf-8", errors="ignore")
            except OSError: continue
            scanned += 1
            rel=str(path.relative_to(repo))
            has_outbox=contains(text,cfg["outbox_terms"])
            has_dispatch=contains(text,cfg["dispatcher_terms"])
            has_tx=contains(text,cfg["transaction_terms"])
            has_retry=contains(text,cfg["retry_terms"])
            if has_outbox and "publish" in text.lower() and re.search(r"finally\s*[{:]", text, re.I):
                findings.append({"severity":"high","path":rel,"code":"publish-finally-risk","message":"Outbox publication and a finally block coexist; verify completion is not recorded after failed publish."})
            if has_outbox and has_dispatch and not has_retry:
                findings.append({"severity":"medium","path":rel,"code":"dispatcher-without-visible-retry","message":"Dispatcher-like outbox code has no obvious retry/failure state terms; inspect manually."})
            if has_outbox and ("add" in text.lower() or "insert" in text.lower()) and not has_tx:
                findings.append({"severity":"medium","path":rel,"code":"outbox-write-without-visible-transaction","message":"Outbox persistence found without obvious transaction terms; prove atomicity from surrounding unit-of-work behavior."})
            if has_outbox and has_dispatch and re.search(r"while\s*\(\s*true\s*\)|while\s+true", text, re.I) and not has_retry:
                findings.append({"severity":"high","path":rel,"code":"unbounded-loop-risk","message":"Potential unbounded dispatcher loop without visible retry/backoff state."})
    result={"scanned_files":scanned,"findings":findings,"counts":{s:sum(1 for f in findings if f["severity"]==s) for s in ["high","medium","low"]}}
    pathlib.Path(a.output).write_text(json.dumps(result, indent=2)+"\n", encoding="utf-8")
    high=result["counts"]["high"]
    print(json.dumps(result, indent=2))
    return 1 if high > cfg["max_high_findings"] else 0
if __name__=="__main__": raise SystemExit(main())

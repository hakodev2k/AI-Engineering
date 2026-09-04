#!/usr/bin/env python3
import argparse, fnmatch, json, math, re, sys
from collections import Counter
from pathlib import Path

TEXT_SUFFIXES={".json",".yaml",".yml",".txt",".xml",".csv",".sql",".http",".har",".snap",".cassette",".js",".ts",".py",".cs",".java",".rb",".go",".toml",".ini",".env"}

def entropy(s):
    if not s: return 0.0
    c=Counter(s); n=len(s)
    return -sum((v/n)*math.log2(v/n) for v in c.values())

def fixture_candidate(rel, globs):
    s=rel.as_posix()
    return any(fnmatch.fnmatch(s,g) or fnmatch.fnmatch("/"+s, g) for g in globs)

def line_of(text, idx): return text.count("\n",0,idx)+1

def add(out,path,text,match,rule,severity,detail):
    out.append({"path":path,"line":line_of(text,match.start()),"rule":rule,"severity":severity,"detail":detail})

def scan_file(path, rel, cfg):
    try:
        if path.stat().st_size > cfg["max_file_bytes"]: return [{"path":rel,"line":1,"rule":"oversize_fixture","severity":"review","detail":"file exceeds max_file_bytes; inspect manually"}]
        raw=path.read_bytes()
        if b"\x00" in raw: return [{"path":rel,"line":1,"rule":"binary_fixture","severity":"review","detail":"binary fixture not scanned"}]
        text=raw.decode("utf-8")
    except (OSError,UnicodeDecodeError) as e:
        return [{"path":rel,"line":1,"rule":"unreadable_fixture","severity":"review","detail":str(e)}]
    findings=[]
    for name,pat in cfg["blocking_patterns"].items():
        for m in re.finditer(pat,text): add(findings,rel,text,m,name,"blocking","blocking pattern")
    for pat in cfg["production_domain_patterns"]:
        rx=re.compile(pat,re.I)
        for m in re.finditer(r"(?i)\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b",text):
            domain=m.group(0).lower()
            if any(domain==d or domain.endswith("."+d) for d in cfg["allowed_synthetic_domains"]): continue
            if rx.search(domain): add(findings,rel,text,m,"production_domain","blocking",domain)
    keyrx=re.compile(r"(?i)[\"']?([A-Za-z0-9_.-]+)[\"']?\s*[:=]\s*[\"']([^\"'\n]{6,})[\"']")
    sensitive=[re.compile(p,re.I) for p in cfg["sensitive_key_patterns"]]
    for m in keyrx.finditer(text):
        if any(r.search(m.group(1)) for r in sensitive): add(findings,rel,text,m,"sensitive_key_value","blocking",m.group(1))
    for name,pat in cfg["review_patterns"].items():
        for m in re.finditer(pat,text):
            val=m.group(0)
            if name=="email" and any(val.lower().endswith("@"+d) for d in cfg["allowed_synthetic_domains"]): continue
            if name=="ipv4" and (val.startswith("127.") or val.startswith("192.0.2.") or val.startswith("198.51.100.") or val.startswith("203.0.113.")): continue
            add(findings,rel,text,m,name,"review",val[:120])
    he=cfg["high_entropy"]
    if he.get("enabled"):
        tokenrx=re.compile(r"[A-Za-z0-9_+./=-]{%d,}"%he["min_length"])
        for m in tokenrx.finditer(text):
            token=m.group(0)
            if entropy(token)>=he["min_shannon_entropy"]:
                add(findings,rel,text,m,"high_entropy_token","review",f"length={len(token)} entropy={entropy(token):.2f}")
    return findings

def main():
    p=argparse.ArgumentParser(); p.add_argument("--repo",required=True); p.add_argument("--config",required=True); p.add_argument("--output",required=True); a=p.parse_args()
    repo=Path(a.repo).resolve(); out=Path(a.output)
    if not repo.is_dir(): print("repo is not a directory",file=sys.stderr); return 3
    try: cfg=json.loads(Path(a.config).read_text(encoding="utf-8"))
    except Exception as e: print(f"config error: {e}",file=sys.stderr); return 3
    excluded=set(cfg["exclude_dirs"]); findings=[]; scanned=[]
    for path in repo.rglob("*"):
        if not path.is_file(): continue
        rel=path.relative_to(repo)
        if any(part in excluded for part in rel.parts): continue
        if not fixture_candidate(rel,cfg["fixture_globs"]): continue
        if path.suffix.lower() not in TEXT_SUFFIXES and path.suffix: continue
        scanned.append(rel.as_posix()); findings.extend(scan_file(path,rel.as_posix(),cfg))
    blocking=sum(1 for f in findings if f["severity"]=="blocking")
    review=sum(1 for f in findings if f["severity"]=="review")
    result={"repo":str(repo),"scanned_files":scanned,"findings":findings,"summary":{"scanned":len(scanned),"blocking":blocking,"review":review}}
    out.parent.mkdir(parents=True,exist_ok=True); out.write_text(json.dumps(result,indent=2),encoding="utf-8")
    print(json.dumps(result["summary"]))
    if blocking or (cfg.get("block_on_review_findings") and review): return 2
    return 0
if __name__=="__main__": raise SystemExit(main())

#!/usr/bin/env python3
import argparse, json, pathlib, re, subprocess, sys

PATTERNS = {
    "concurrency-token": re.compile(r"rowversion|timestamp|concurrencytoken|isconcurrencytoken|etag|if-match|version", re.I),
    "write": re.compile(r"savechanges|updateasync|executeupdate|replaceitem|upsert|update\s+.+\s+set", re.I),
    "retry": re.compile(r"retry|waitandretry|executionstrategy", re.I),
}
TEXT_EXT = {".cs", ".java", ".kt", ".py", ".js", ".ts", ".sql", ".go", ".rs"}
SKIP = {".git", "node_modules", "bin", "obj", "dist", "build"}

def root(path):
    p=pathlib.Path(path).resolve()
    if not p.exists() or not (p/".git").exists(): raise ValueError("--repo must be an existing Git working tree")
    return p

def files(repo):
    for p in repo.rglob("*"):
        if p.is_file() and p.suffix.lower() in TEXT_EXT and not any(x in SKIP for x in p.parts): yield p

def preflight(repo):
    cp=subprocess.run(["git","-C",str(repo),"diff","--check"],capture_output=True,text=True)
    if cp.returncode: print(cp.stdout+cp.stderr, file=sys.stderr); return 2
    print("preflight: ok"); return 0

def scan(repo):
    findings=[]
    for p in files(repo):
        try: text=p.read_text(encoding="utf-8",errors="ignore")
        except OSError: continue
        hits=[name for name,rx in PATTERNS.items() if rx.search(text)]
        if hits: findings.append({"path":str(p.relative_to(repo)),"signals":hits})
    print(json.dumps({"findings":findings,"count":len(findings)},indent=2)); return 0

def verify(repo, report_path):
    p=pathlib.Path(report_path)
    if not p.is_absolute(): p=repo/p
    try: data=json.loads(p.read_text(encoding="utf-8"))
    except Exception as e: print(f"invalid report: {e}",file=sys.stderr); return 2
    required=["status","two_writer_test","build","targeted_tests","unintended_changes","approval"]
    missing=[k for k in required if k not in data]
    if missing: print("missing fields: "+", ".join(missing),file=sys.stderr); return 2
    ok=(data["status"]=="verified" and data["two_writer_test"]=="passed" and data["build"]=="passed" and data["targeted_tests"]=="passed" and data["unintended_changes"]=="none" and data["approval"] in ("not-required","obtained"))
    print(json.dumps({"verification":"passed" if ok else "failed"},indent=2)); return 0 if ok else 3

def main():
    ap=argparse.ArgumentParser(description="Deterministic optimistic-concurrency workflow gate")
    sub=ap.add_subparsers(dest="cmd",required=True)
    for name in ("preflight","scan"):
        s=sub.add_parser(name); s.add_argument("--repo",default=".")
    v=sub.add_parser("verify"); v.add_argument("--repo",default="."); v.add_argument("--report",required=True)
    a=ap.parse_args()
    try: repo=root(a.repo)
    except ValueError as e: print(e,file=sys.stderr); return 2
    if a.cmd=="preflight": return preflight(repo)
    if a.cmd=="scan": return scan(repo)
    return verify(repo,a.report)
if __name__=="__main__": sys.exit(main())

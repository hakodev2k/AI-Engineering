#!/usr/bin/env python3
import argparse, json, os, re, sys

PATTERNS = {
    "transaction-start": re.compile(r"BeginTransaction|TransactionScope|transaction\(|@Transactional|BEGIN\s+TRAN", re.I),
    "commit": re.compile(r"Commit|SaveChanges|commit\(|COMMIT\b", re.I),
    "rollback": re.compile(r"Rollback|ROLLBACK\b", re.I),
    "external-side-effect": re.compile(r"HttpClient|SendAsync|Publish|SendEmail|SendMail|ProduceAsync|Kafka|Rabbit|Smtp|GraphServiceClient", re.I),
    "retry": re.compile(r"Retry|Polly|retry\(|ExecuteAsync|for\s*\(|while\s*\(", re.I),
    "outbox": re.compile(r"Outbox|Inbox|Idempotency", re.I),
    "blocking": re.compile(r"\.Result\b|\.Wait\(\)", re.I),
}

def scan_file(path):
    try:
        text = open(path, encoding="utf-8", errors="ignore").read()
    except OSError:
        return []
    hits=[]
    for name, rx in PATTERNS.items():
        for m in rx.finditer(text):
            line=text.count("\n",0,m.start())+1
            hits.append({"kind":name,"line":line,"excerpt":text.splitlines()[line-1][:240]})
    return hits

def main():
    p=argparse.ArgumentParser()
    p.add_argument("root", nargs="?", default=".")
    p.add_argument("--json", action="store_true")
    p.add_argument("--fail-on-risk", action="store_true")
    a=p.parse_args()
    exts={".cs",".ts",".js",".py",".java",".sql"}
    excludes={".git","node_modules","bin","obj","dist","build","vendor"}
    files=[]
    for base, dirs, names in os.walk(a.root):
        dirs[:] = [d for d in dirs if d not in excludes]
        for n in names:
            if os.path.splitext(n)[1].lower() in exts:
                path=os.path.join(base,n); hits=scan_file(path)
                if hits: files.append({"path":os.path.relpath(path,a.root),"hits":hits})
    risk=[]
    for f in files:
        kinds={h["kind"] for h in f["hits"]}
        if "external-side-effect" in kinds and ("transaction-start" in kinds or "commit" in kinds):
            risk.append({"path":f["path"],"risk":"side-effect-near-transaction","severity":"high"})
        if "retry" in kinds and "external-side-effect" in kinds and "outbox" not in kinds:
            risk.append({"path":f["path"],"risk":"retry-with-nontransactional-side-effect","severity":"high"})
        if "transaction-start" in kinds and "rollback" not in kinds:
            risk.append({"path":f["path"],"risk":"transaction-without-visible-rollback","severity":"medium"})
        if "blocking" in kinds:
            risk.append({"path":f["path"],"risk":"blocking-wait-in-transaction-path","severity":"medium"})
    out={"files":files,"risks":risk,"riskCount":len(risk)}
    print(json.dumps(out,indent=2) if a.json else "\n".join(f'{r["severity"]}: {r["path"]}: {r["risk"]}' for r in risk) or "No heuristic transaction risks found.")
    if a.fail_on_risk and risk: return 2
    return 0

if __name__=="__main__": sys.exit(main())

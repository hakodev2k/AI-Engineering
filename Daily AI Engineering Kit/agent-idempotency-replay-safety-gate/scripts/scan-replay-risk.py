#!/usr/bin/env python3
import argparse, json, pathlib, re, sys

DEFAULT_MARKERS = ["SaveChangesAsync", "SaveChanges(", "SendAsync", "PublishAsync", "Enqueue", "ExecuteSql", "HttpClient"]
IDEMPOTENCY = [r"Idempotency[-_]Key", r"X-Request-Id", r"idempotenc", r"requestId", r"request_id"]
EXTENSIONS = {".cs", ".ts", ".js", ".py", ".java", ".go"}

def scan(root: pathlib.Path):
    findings=[]
    for p in root.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in EXTENSIONS or any(x in p.parts for x in (".git","bin","obj","node_modules")):
            continue
        try: text=p.read_text(encoding="utf-8", errors="ignore")
        except OSError: continue
        markers=[m for m in DEFAULT_MARKERS if m.lower() in text.lower()]
        if not markers: continue
        idem=any(re.search(pattern,text,re.I) for pattern in IDEMPOTENCY)
        findings.append({"file":str(p.relative_to(root)),"side_effect_markers":markers,"idempotency_signal":idem,"risk":"review" if idem else "high"})
    return findings

def main():
    ap=argparse.ArgumentParser(description="Conservative static scan for replay-sensitive side effects.")
    ap.add_argument("root", nargs="?", default=".")
    ap.add_argument("--output", default="replay-risk.json")
    ap.add_argument("--fail-on-high", action="store_true")
    args=ap.parse_args(); root=pathlib.Path(args.root).resolve()
    if not root.is_dir(): print("root must be a directory", file=sys.stderr); return 2
    findings=scan(root)
    result={"scanner":"replay-risk-v1","root":str(root),"finding_count":len(findings),"findings":findings}
    pathlib.Path(args.output).write_text(json.dumps(result,indent=2),encoding="utf-8")
    high=sum(f["risk"]=="high" for f in findings)
    print(f"scanned: {len(findings)} side-effect files; high-risk: {high}; output: {args.output}")
    return 3 if args.fail_on_high and high else 0
if __name__ == "__main__": raise SystemExit(main())

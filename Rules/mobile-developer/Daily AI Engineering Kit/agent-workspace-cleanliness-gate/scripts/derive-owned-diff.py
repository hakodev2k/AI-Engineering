#!/usr/bin/env python3
import argparse, fnmatch, hashlib, json, sys
from pathlib import Path


def load(path): return json.loads(Path(path).read_text(encoding="utf-8"))
def matches(path, patterns): return any(fnmatch.fnmatch(path, p) or path == p.rstrip("/") or path.startswith(p.rstrip("/") + "/") for p in patterns)
def fp(obj): return hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def main():
    ap=argparse.ArgumentParser(description="Classify workspace changes relative to a baseline and explicit ownership scope")
    ap.add_argument("--baseline",required=True); ap.add_argument("--current",required=True); ap.add_argument("--manifest",required=True); ap.add_argument("--output",required=True)
    a=ap.parse_args()
    try: b,c,m=load(a.baseline),load(a.current),load(a.manifest)
    except Exception as e: print(f"input error: {e}",file=sys.stderr); return 2
    errors=[]
    if m.get("baseline_fingerprint")!=b.get("status_fingerprint"): errors.append("manifest-baseline-fingerprint-mismatch")
    if m.get("baseline_head")!=b.get("head"): errors.append("manifest-baseline-head-mismatch")
    bm={x["path"]:x for x in b.get("entries",[])}; cm={x["path"]:x for x in c.get("entries",[])}
    records=[]
    for path in sorted(set(bm)|set(cm)):
        before,after=bm.get(path),cm.get(path)
        if before is None and after is not None: cls="agent-created"
        elif before is not None and after is None: cls="resolved-preexisting"
        elif before==after: cls="preexisting-unchanged"
        else: cls="touched-preexisting"
        allowed=matches(path,m.get("allowed_paths",[])); forbidden=matches(path,m.get("forbidden_paths",[]))
        records.append({"path":path,"classification":cls,"allowed":allowed,"forbidden":forbidden,"before":before,"after":after})
    owned=[r for r in records if r["classification"]!="preexisting-unchanged" and r["allowed"] and not r["forbidden"]]
    unowned=[r for r in records if r["classification"]!="preexisting-unchanged" and (not r["allowed"] or r["forbidden"])]
    touched=[r for r in records if r["classification"] in ("touched-preexisting","resolved-preexisting")]
    result={"version":"1.0.0","task_id":m.get("task_id"),"baseline_head":b.get("head"),"current_head":c.get("head"),"baseline_fingerprint":b.get("status_fingerprint"),"current_fingerprint":c.get("status_fingerprint"),"records":records,"owned_paths":[r["path"] for r in owned],"unowned_paths":[r["path"] for r in unowned],"preexisting_touched_paths":[r["path"] for r in touched],"errors":errors}
    result["owned_diff_fingerprint"]=fp({k:result[k] for k in ["task_id","baseline_head","current_head","baseline_fingerprint","current_fingerprint","records"]})
    Path(a.output).write_text(json.dumps(result,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"status":"derived" if not errors else "invalid","owned":len(owned),"unowned":len(unowned),"preexisting_touched":len(touched),"fingerprint":result["owned_diff_fingerprint"]}))
    return 0 if not errors else 4
if __name__=="__main__": raise SystemExit(main())

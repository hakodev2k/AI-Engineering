#!/usr/bin/env python3
import argparse, hashlib, json, re, sys
from pathlib import Path

def canonical(v): return json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False)
def digest(v): return hashlib.sha256(canonical(v).encode("utf-8")).hexdigest()
def line_sig(line): return hashlib.sha256(re.sub(r"\s+"," ",line.strip()).encode("utf-8")).hexdigest()[:16]
def content_sigs(text): return {line_sig(x) for x in text.splitlines() if len(x.strip())>=4 and not x.strip().startswith(("//","#","/*","*"))}
def main():
 ap=argparse.ArgumentParser(); ap.add_argument("--inventory",required=True); ap.add_argument("--resolution",required=True); ap.add_argument("--policy",required=True); ap.add_argument("--root",default="."); ap.add_argument("--output",required=True); ns=ap.parse_args()
 try:
  inv=json.load(open(ns.inventory,encoding="utf-8")); res=json.load(open(ns.resolution,encoding="utf-8")); pol=json.load(open(ns.policy,encoding="utf-8"))
  findings=[]; results=[]; byid={x["conflict_id"]:x for x in res.get("resolutions",[])}
  if inv.get("repository_revision")!=res.get("repository_revision"): findings.append("resolution-revision-mismatch")
  root=Path(ns.root)
  for c in inv.get("conflicts",[]):
   d=byid.get(c["id"]); blockers=[]; warnings=[]
   p=root/c["file"]
   if not d: blockers.append("missing-resolution-decision")
   if not p.exists(): blockers.append("resolved-file-missing")
   else:
    text=p.read_text(encoding="utf-8")
    if any(m in text for m in ("<<<<<<< ","=======",">>>>>>> ")): blockers.append("conflict-marker-remains")
    if d:
     if len(d.get("rationale","").strip())<10: blockers.append("missing-rationale")
     if not d.get("targeted_checks"): blockers.append("missing-targeted-check")
     sigs=content_sigs(text); ss=c.get("side_signatures",{})
     ours=set(ss.get("ours",[])); theirs=set(ss.get("theirs",[])); preserved=set(d.get("preserved",[]))
     if "ours" in preserved and ours and not (ours & sigs): blockers.append("declared-ours-preserved-but-no-signature")
     if "theirs" in preserved and theirs and not (theirs & sigs): blockers.append("declared-theirs-preserved-but-no-signature")
     if "both" in preserved:
      if ours and not (ours&sigs): blockers.append("both-declared-but-ours-signature-missing")
      if theirs and not (theirs&sigs): blockers.append("both-declared-but-theirs-signature-missing")
     if "neither-with-justification" in preserved and len(d.get("rationale","").strip())<30: blockers.append("neither-preserved-needs-strong-justification")
     if c.get("risk") in ("high","critical"): warnings.append("high-risk-conflict")
     if d.get("approval_action") in pol.get("approval_required_actions",[]): warnings.append("human-approval-required:"+d["approval_action"])
   results.append({"conflict_id":c["id"],"file":c["file"],"risk":c.get("risk"),"blockers":blockers,"warnings":warnings})
   findings += [c["id"]+":"+x for x in blockers]
  status="blocked" if findings else ("review-required" if any(r["warnings"] for r in results) else "pass")
  out={"version":"1.0","status":status,"repository_revision":inv.get("repository_revision"),"inventory_fingerprint":digest(inv),"policy_fingerprint":digest(pol),"findings":findings,"conflict_results":results}
  out["report_fingerprint"]=digest(out)
  Path(ns.output).write_text(json.dumps(out,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
  print(json.dumps({"status":status,"report_fingerprint":out["report_fingerprint"]})); return 2 if status=="blocked" else (3 if status=="review-required" else 0)
 except Exception as e: print(json.dumps({"status":"error","error":str(e)})); return 1
if __name__=="__main__": sys.exit(main())

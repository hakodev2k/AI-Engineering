#!/usr/bin/env python3
import hashlib, json, sys
from pathlib import Path

def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr); sys.exit(2)

def file_hash(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def main():
    if len(sys.argv)!=5: fail("usage: evaluate-context-gate.py <manifest.json> <report.json> <review.json> <gate.json>")
    mp,rp,rvp,out=map(Path,sys.argv[1:])
    for p in (mp,rp,rvp):
        if not p.is_file(): fail(f"missing input: {p}")
    manifest=json.loads(mp.read_text(encoding="utf-8")); report=json.loads(rp.read_text(encoding="utf-8")); review=json.loads(rvp.read_text(encoding="utf-8"))
    reasons=[]
    if report.get("blocking_count",0)!=0: reasons.append("blocking staleness findings remain")
    if report.get("manifest_revision")!=manifest.get("revision"): reasons.append("report manifest revision mismatch")
    if review.get("status")!="verified": reasons.append("review status is not verified")
    if review.get("reviewer_id")==review.get("curator_id"): reasons.append("reviewer is not independent")
    expected_hash=file_hash(mp)
    if review.get("manifest_sha256")!=expected_hash: reasons.append("review was not performed on current manifest")
    status="verified" if not reasons else "blocked"
    result={"status":status,"manifest_sha256":expected_hash,"current_revision":report.get("current_revision"),"reasons":reasons}
    out.parent.mkdir(parents=True,exist_ok=True); out.write_text(json.dumps(result,indent=2)+"\n",encoding="utf-8")
    print(status)
    sys.exit(0 if status=="verified" else 1)

if __name__=="__main__": main()

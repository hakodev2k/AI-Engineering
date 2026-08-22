#!/usr/bin/env python3
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPTS=ROOT/"scripts"
POLICY=ROOT/"config"/"approval-context-policy.json"

def sha(ch): return ch*64

def context(rev="r1", plan=None, actor="agent-a"):
    return {"version":"1.0","task_id":"t1","risk":"high","action_type":"production-deploy","target_environment":"production","repository_revision":rev,"plan_fingerprint":plan or sha("a"),"resource_fingerprint":sha("b"),"command_fingerprint":sha("c"),"permission_fingerprint":sha("d"),"actor_id":actor,"dangerous_action":True}

def fp(c):
    fields=["task_id","risk","action_type","target_environment","repository_revision","plan_fingerprint","resource_fingerprint","command_fingerprint","permission_fingerprint","actor_id","dangerous_action"]
    payload=json.dumps({k:c.get(k) for k in fields},sort_keys=True,separators=(",",":"),ensure_ascii=False)
    return hashlib.sha256(payload.encode()).hexdigest()

def run(args, expected):
    p=subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
    if p.returncode!=expected: raise AssertionError(f"expected {expected}, got {p.returncode}: {p.stdout} {p.stderr}")
    return json.loads(p.stdout or p.stderr)

def main():
    with tempfile.TemporaryDirectory() as td:
        d=Path(td); base=context(); cur=context()
        for name,obj in (("base.json",base),("cur.json",cur)):
            (d/name).write_text(json.dumps(obj),encoding="utf-8")
        unchanged=run([SCRIPTS/"evaluate-context-drift.py",d/"base.json",d/"cur.json"],0)
        assert unchanged["status"]=="unchanged"

        approval={"version":"1.0","approval_id":"a1","task_id":"t1","context_fingerprint":fp(cur),"approver_id":"human","approved":True,"approved_at_utc":"2026-08-17T14:30:00Z"}
        review={"version":"1.0","task_id":"t1","context_fingerprint":fp(cur),"reviewer_id":"reviewer-b","status":"approved","reviewed_at_utc":"2026-08-17T14:31:00Z","findings":[]}
        (d/"approval.json").write_text(json.dumps(approval),encoding="utf-8"); (d/"review.json").write_text(json.dumps(review),encoding="utf-8")
        gate=run([SCRIPTS/"evaluate-final-gate.py",d/"cur.json",d/"approval.json","--review",d/"review.json","--policy",POLICY],0)
        assert gate["status"]=="verified"

        drift=context(rev="r2"); (d/"drift.json").write_text(json.dumps(drift),encoding="utf-8")
        report=run([SCRIPTS/"evaluate-context-drift.py",d/"base.json",d/"drift.json"],3)
        assert "repository_revision" in report["changed_fields"]

        bad_review=dict(review); bad_review["reviewer_id"]="agent-a"; (d/"bad-review.json").write_text(json.dumps(bad_review),encoding="utf-8")
        blocked=run([SCRIPTS/"evaluate-final-gate.py",d/"cur.json",d/"approval.json","--review",d/"bad-review.json","--policy",POLICY],3)
        assert "self-review" in blocked["reasons"]

        changed=context(plan=sha("f")); (d/"changed.json").write_text(json.dumps(changed),encoding="utf-8")
        stale=run([SCRIPTS/"evaluate-final-gate.py",d/"changed.json",d/"approval.json","--review",d/"review.json","--policy",POLICY],3)
        assert "context-fingerprint-mismatch" in stale["reasons"]
    print("smoke tests passed")
if __name__=="__main__": main()

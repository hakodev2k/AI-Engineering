#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPTS=ROOT/"scripts"
POLICY=ROOT/"config"/"freshness-policy.json"


def run(args, ok=(0,)):
    p=subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
    if p.returncode not in ok:
        raise AssertionError(f"cmd failed {args}: {p.returncode}\n{p.stdout}\n{p.stderr}")
    return json.loads(p.stdout)


def write(path,obj): path.write_text(json.dumps(obj),encoding="utf-8")


def main():
    with tempfile.TemporaryDirectory() as td:
        d=Path(td)
        rec={
          "result_id":"r1","supersedes_result_id":None,
          "source":{"kind":"repository","identity":"repo:demo","revision":"abc123"},
          "tool_name":"git-read",
          "query_fingerprint":"a"*64,"result_fingerprint":"b"*64,
          "observed_at":"2026-08-17T10:00:00Z","volatility":"low","policy_id":"1.0.0",
          "invalidation_signals":["repository-head-changed"],
          "dependent_decisions":["implementation"],"artifact_path":None
        }
        state={"sources":{"repo:demo":{"revision":"abc123"}},"expected_query_fingerprints":{"r1":"a"*64}}
        events={"events":[]}
        review={"reviewer_id":"reviewer","curator_id":"curator","reviewed_result_ids":["r1"],"decision_risk":"low","status":"approved","human_approval_required":False,"human_approval_present":False}
        for name,obj in [("rec.json",rec),("state.json",state),("events.json",events),("review.json",review)]: write(d/name,obj)
        assert run([SCRIPTS/"validate-freshness-record.py",d/"rec.json"])["status"]=="valid"
        fresh=run([SCRIPTS/"evaluate-freshness.py","--record",d/"rec.json","--state",d/"state.json","--events",d/"events.json","--policy",POLICY,"--now","2026-08-17T10:10:00Z"])
        assert fresh["status"]=="fresh"
        write(d/"evals.json",[fresh])
        gate=run([SCRIPTS/"evaluate-freshness-gate.py","--evaluations",d/"evals.json","--review",d/"review.json","--policy",POLICY])
        assert gate["status"]=="verified"

        expired=run([SCRIPTS/"evaluate-freshness.py","--record",d/"rec.json","--state",d/"state.json","--events",d/"events.json","--policy",POLICY,"--now","2026-08-17T12:00:01Z"],ok=(3,))
        assert "ttl-expired" in expired["reasons"]

        state["sources"]["repo:demo"]["revision"]="def456"; write(d/"state.json",state)
        stale=run([SCRIPTS/"evaluate-freshness.py","--record",d/"rec.json","--state",d/"state.json","--events",d/"events.json","--policy",POLICY,"--now","2026-08-17T10:10:00Z"],ok=(3,))
        assert "source-revision-changed" in stale["reasons"]

        state["sources"]["repo:demo"]["revision"]="abc123"; write(d/"state.json",state)
        events={"events":[{"type":"repository-head-changed","source_identity":"repo:demo","occurred_at":"2026-08-17T10:05:00Z"}]}; write(d/"events.json",events)
        stale2=run([SCRIPTS/"evaluate-freshness.py","--record",d/"rec.json","--state",d/"state.json","--events",d/"events.json","--policy",POLICY,"--now","2026-08-17T10:10:00Z"],ok=(3,))
        assert any(x.startswith("invalidation-event:") for x in stale2["reasons"])

        review.update({"decision_risk":"high","reviewer_id":"curator","curator_id":"curator"}); write(d/"review.json",review)
        write(d/"evals.json",[fresh])
        blocked=run([SCRIPTS/"evaluate-freshness-gate.py","--evaluations",d/"evals.json","--review",d/"review.json","--policy",POLICY],ok=(4,))
        assert "high-risk-review-not-independent" in blocked["reasons"]
    print("smoke-test: PASS")
    return 0

if __name__=="__main__": sys.exit(main())

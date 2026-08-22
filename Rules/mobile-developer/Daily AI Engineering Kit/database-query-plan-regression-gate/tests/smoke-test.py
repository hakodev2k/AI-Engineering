#!/usr/bin/env python3
import copy, json, subprocess, sys, tempfile
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PY=sys.executable

def run(*args, expect=0):
    p=subprocess.run([PY,*map(str,args)],capture_output=True,text=True)
    if p.returncode!=expect:
        raise AssertionError(f"command failed rc={p.returncode} expected={expect}\nstdout={p.stdout}\nstderr={p.stderr}")
    return p

def write(path,obj): path.write_text(json.dumps(obj,indent=2),encoding="utf-8")

def main():
    now=datetime.now(timezone.utc).isoformat()
    base={
      "query_id":"orders-by-customer","engine":"sqlserver","captured_at":now,
      "dataset_profile":"staging-10m-orders-p95","source_revision":"base123","environment":"staging",
      "metrics":{"duration_ms":100,"cpu_ms":70,"logical_reads":1000,"estimated_rows":1000,"actual_rows":1000},
      "operators":{"full_scan_count":0,"sort_count":1,"hash_count":0,"key_lookup_count":1,"spill_count":0},"notes":[]}
    policy=ROOT/"config/query-plan-policy.json"
    with tempfile.TemporaryDirectory() as td:
      d=Path(td); b=d/"baseline.json"; c=d/"candidate.json"; cmp=d/"comparison.json"; gate=d/"gate.json"; rev=d/"review.json"
      write(b,base)
      good=copy.deepcopy(base); good["source_revision"]="cand-good"; good["metrics"]["duration_ms"]=105; write(c,good)
      run(ROOT/"scripts/validate-query-plan-evidence.py",b); run(ROOT/"scripts/validate-query-plan-evidence.py",c)
      run(ROOT/"scripts/compare-query-plans.py",b,c,"--policy",policy,"--output",cmp)
      run(ROOT/"scripts/evaluate-query-plan-gate.py",cmp,"--policy",policy,"--output",gate)
      assert json.load(open(gate))["status"]=="verified"

      warning=copy.deepcopy(base); warning["source_revision"]="cand-warning"; warning["metrics"]["duration_ms"]=135; write(c,warning)
      run(ROOT/"scripts/compare-query-plans.py",b,c,"--policy",policy,"--output",cmp)
      comp=json.load(open(cmp)); assert comp["status"]=="review-required"
      write(rev,{"reviewer":"database-reviewer","comparison_fingerprint":comp["comparison_fingerprint"],"status":"approved","findings":["acceptable measured tradeoff"]})
      run(ROOT/"scripts/evaluate-query-plan-gate.py",cmp,"--policy",policy,"--review",rev,"--output",gate)
      assert json.load(open(gate))["status"]=="verified"

      bad=copy.deepcopy(base); bad["source_revision"]="cand-bad"; bad["metrics"]["logical_reads"]=2500; bad["operators"]["full_scan_count"]=1; write(c,bad)
      run(ROOT/"scripts/compare-query-plans.py",b,c,"--policy",policy,"--output",cmp,expect=2)
      comp=json.load(open(cmp)); assert comp["status"]=="blocked"
      write(rev,{"reviewer":"database-reviewer","comparison_fingerprint":comp["comparison_fingerprint"],"status":"approved","findings":["attempted override"]})
      run(ROOT/"scripts/evaluate-query-plan-gate.py",cmp,"--policy",policy,"--review",rev,"--output",gate,expect=2)
      assert json.load(open(gate))["status"]=="blocked"

      mismatch=copy.deepcopy(base); mismatch["dataset_profile"]="tiny-dev-db"; mismatch["source_revision"]="cand-mismatch"; write(c,mismatch)
      run(ROOT/"scripts/compare-query-plans.py",b,c,"--policy",policy,"--output",cmp,expect=2)
      assert "dataset-profile-mismatch" in json.load(open(cmp))["blockers"]

      stale=copy.deepcopy(base); stale["captured_at"]=(datetime.now(timezone.utc)-timedelta(hours=3)).isoformat(); stale["source_revision"]="cand-stale"; write(c,stale)
      run(ROOT/"scripts/compare-query-plans.py",b,c,"--policy",policy,"--output",cmp,expect=2)
      assert "candidate-evidence-stale" in json.load(open(cmp))["blockers"]
    print("SMOKE TEST PASSED")

if __name__=="__main__": main()

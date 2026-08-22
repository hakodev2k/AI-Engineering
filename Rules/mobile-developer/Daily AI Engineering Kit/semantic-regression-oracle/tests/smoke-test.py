#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def run(*args, expected=0):
    p = subprocess.run([sys.executable, *map(str, args)], cwd=ROOT, text=True, capture_output=True)
    if p.returncode != expected:
        raise SystemExit(f"command failed ({p.returncode} != {expected}): {' '.join(map(str,args))}\n{p.stdout}\n{p.stderr}")
    return p

def main():
    with tempfile.TemporaryDirectory() as td:
        d=Path(td)
        suite={"suite_id":"smoke","version":"1","scenarios":[{"id":"critical-total","critical":True,"category":"financial-calculation","evidence":["requirement:X"],"numeric_tolerance":0.0,"assertions":[{"path":"/total","mode":"numeric"}]}]}
        base={"suite":"smoke@1","results":{"critical-total":{"total":10.0}}}
        same={"suite":"smoke@1","results":{"critical-total":{"total":10.0}}}
        changed={"suite":"smoke@1","results":{"critical-total":{"total":9.0}}}
        review_ok={"reviewer":"reviewer","implementer":"impl","decisions":[]}
        review_bad={"reviewer":"reviewer","implementer":"impl","decisions":[{"scenario_id":"critical-total","classification":"regression","evidence":["requirement:X"]}]}
        paths={}
        for name,obj in [("suite",suite),("base",base),("same",same),("changed",changed),("review_ok",review_ok),("review_bad",review_bad)]:
            p=d/f"{name}.json"; p.write_text(json.dumps(obj),encoding="utf-8"); paths[name]=p
        report_same=d/"same-report.json"; report_changed=d/"changed-report.json"
        run("scripts/validate-scenario-suite.py", paths["suite"])
        run("scripts/compare-semantic-results.py","--suite",paths["suite"],"--baseline",paths["base"],"--candidate",paths["same"],"--out",report_same)
        run("scripts/evaluate-semantic-gate.py","--report",report_same,"--review",paths["review_ok"],"--policy","config/semantic-policy.json")
        run("scripts/compare-semantic-results.py","--suite",paths["suite"],"--baseline",paths["base"],"--candidate",paths["changed"],"--out",report_changed)
        run("scripts/evaluate-semantic-gate.py","--report",report_changed,"--review",paths["review_bad"],"--policy","config/semantic-policy.json", expected=1)
    print("SMOKE TEST PASSED")

if __name__ == "__main__": main()
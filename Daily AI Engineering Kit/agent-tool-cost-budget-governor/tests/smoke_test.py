#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PY=sys.executable

def run(args, expect):
    p=subprocess.run(args,cwd=ROOT,text=True,capture_output=True)
    if p.returncode!=expect:
        print(p.stdout); print(p.stderr,file=sys.stderr); raise SystemExit(f"expected {expect}, got {p.returncode}: {' '.join(map(str,args))}")
    return p

with tempfile.TemporaryDirectory() as td:
    out=Path(td)/"reconciliation.json"
    run([PY,"scripts/validate_budget.py","--plan","templates/budget-plan.json","--policy","config/cost-policy.json"],0)
    run([PY,"scripts/reconcile_spend.py","--plan","templates/budget-plan.json","--ledger","examples/spend-ledger.json","--policy","config/cost-policy.json","--out",str(out)],0)
    allow=run([PY,"scripts/evaluate_spend_gate.py","--plan","templates/budget-plan.json","--ledger","examples/spend-ledger.json","--policy","config/cost-policy.json"],0)
    assert json.loads(allow.stdout)["status"]=="allow"

    ledger=json.loads((ROOT/"examples/spend-ledger.json").read_text())
    ledger["entries"].append({"stage":"execute","operation":"implementation-model","attempt":2,"cost_class":"metered-known","actual_cost":4.3,"status":"failed"})
    soft=Path(td)/"soft.json"; soft.write_text(json.dumps(ledger))
    p=run([PY,"scripts/evaluate_spend_gate.py","--plan","templates/budget-plan.json","--ledger",str(soft),"--policy","config/cost-policy.json"],3)
    assert json.loads(p.stdout)["status"]=="human-approval-required"

    ledger["entries"].append({"stage":"execute","operation":"implementation-model","attempt":3,"cost_class":"metered-known","actual_cost":2.0,"status":"failed"})
    blocked=Path(td)/"blocked.json"; blocked.write_text(json.dumps(ledger))
    p=run([PY,"scripts/evaluate_spend_gate.py","--plan","templates/budget-plan.json","--ledger",str(blocked),"--policy","config/cost-policy.json"],1)
    assert json.loads(p.stdout)["status"]=="block"

print("smoke test passed")

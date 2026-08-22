#!/usr/bin/env python3
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PY = sys.executable


def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def run(args, expect=0):
    p=subprocess.run(args,capture_output=True,text=True)
    if p.returncode!=expect:
        raise AssertionError(f"expected {expect}, got {p.returncode}\nSTDOUT:{p.stdout}\nSTDERR:{p.stderr}")
    return p.stdout

with tempfile.TemporaryDirectory() as td:
    td=Path(td)
    base=ROOT/'examples/baseline.schema.json'
    good=ROOT/'examples/candidate-compatible.schema.json'
    bad=ROOT/'examples/candidate-breaking.schema.json'
    inst=ROOT/'examples/candidate-instance.json'
    policy=ROOT/'config/contract-policy.json'

    run([PY,str(ROOT/'scripts/validate-contract-instance.py'),'--schema',str(good),'--instance',str(inst)])

    good_report=td/'good-report.json'
    run([PY,str(ROOT/'scripts/compare-contract-schemas.py'),'--baseline',str(base),'--candidate',str(good),'--policy',str(policy),'--out',str(good_report)])
    assert json.loads(good_report.read_text())['status']=='compatible'

    record={
      'contract_name':'example-agent-result','risk':'high','producer':'producer','candidate_author':'author-a',
      'baseline':{'schema_path':str(base),'schema_sha256':sha(base),'revision':'r1','contract_version':'1.0'},
      'candidate':{'schema_path':str(good),'schema_sha256':sha(good),'revision':'r2','contract_version':'1.1'},
      'consumers':[{'name':'consumer-a','mandatory_replay':True}],
      'replay_checks':[{'consumer':'consumer-a','status':'pass','evidence':'smoke','candidate_schema_sha256':sha(good)}],
      'approval':None
    }
    review={'reviewer':'reviewer-b','independent':True,'status':'approved','candidate_schema_sha256':sha(good),'migration_ready':True}
    rp,rv=td/'record.json',td/'review.json'
    rp.write_text(json.dumps(record)); rv.write_text(json.dumps(review))
    out=run([PY,str(ROOT/'scripts/evaluate-contract-gate.py'),'--record',str(rp),'--compatibility',str(good_report),'--review',str(rv),'--policy',str(policy)])
    assert json.loads(out)['status']=='verified'

    bad_report=td/'bad-report.json'
    run([PY,str(ROOT/'scripts/compare-contract-schemas.py'),'--baseline',str(base),'--candidate',str(bad),'--policy',str(policy),'--out',str(bad_report)])
    assert json.loads(bad_report.read_text())['status']=='breaking'
    record['candidate']={'schema_path':str(bad),'schema_sha256':sha(bad),'revision':'r3','contract_version':'2.0'}
    record['replay_checks']=[{'consumer':'consumer-a','status':'pass','evidence':'smoke','candidate_schema_sha256':sha(bad)}]
    rp.write_text(json.dumps(record))
    review['candidate_schema_sha256']=sha(bad); review['status']='breaking'; rv.write_text(json.dumps(review))
    out=run([PY,str(ROOT/'scripts/evaluate-contract-gate.py'),'--record',str(rp),'--compatibility',str(bad_report),'--review',str(rv),'--policy',str(policy)],expect=1)
    assert json.loads(out)['status']=='human-approval-required'

    record['approval']={'approved':True,'approver':'human-owner','candidate_revision':'r3','candidate_schema_sha256':sha(bad)}
    rp.write_text(json.dumps(record))
    out=run([PY,str(ROOT/'scripts/evaluate-contract-gate.py'),'--record',str(rp),'--compatibility',str(bad_report),'--review',str(rv),'--policy',str(policy)])
    assert json.loads(out)['status']=='verified'

    record['candidate']['schema_sha256']='0'*64; rp.write_text(json.dumps(record))
    out=run([PY,str(ROOT/'scripts/evaluate-contract-gate.py'),'--record',str(rp),'--compatibility',str(bad_report),'--review',str(rv),'--policy',str(policy)],expect=1)
    assert json.loads(out)['status']=='blocked'

print('smoke-test: PASS')

import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/"scripts"/"completion_gate.py"
POLICY=ROOT/"config"/"completion-policy.json"


def run(ledger):
    with tempfile.NamedTemporaryFile("w",suffix=".json",delete=False) as f:
        json.dump(ledger,f); p=f.name
    return subprocess.run([sys.executable,str(SCRIPT),p,"--policy",str(POLICY)],capture_output=True,text=True)


def ev(*types):
    return [{"type":t,"fresh":True,"passed":True} for t in types]


def test_tests_passed_requires_execution_pass_and_freshness():
    r=run({"claims":["tests_passed"],"evidence":ev("test_executed","test_passed","evidence_fresh")})
    assert r.returncode==0, r.stdout+r.stderr


def test_missing_execution_blocks_claim():
    r=run({"claims":["tests_passed"],"evidence":ev("test_passed","evidence_fresh")})
    assert r.returncode==4
    assert "test_executed" in json.loads(r.stdout)["unsupported"]["tests_passed"]


def test_stale_evidence_is_not_accepted():
    evidence=ev("test_executed","test_passed")+[{"type":"evidence_fresh","fresh":False,"passed":True}]
    r=run({"claims":["tests_passed"],"evidence":evidence})
    assert r.returncode==4


def test_verified_requires_acceptance_and_canonical_verification():
    r=run({"claims":["verified"],"evidence":ev("acceptance_criteria_covered","canonical_verification_passed","evidence_fresh")})
    assert r.returncode==0


def test_unknown_claim_blocks():
    r=run({"claims":["magic_done"],"evidence":[]})
    assert r.returncode==4

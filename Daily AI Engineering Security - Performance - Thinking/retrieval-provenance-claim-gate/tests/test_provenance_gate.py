import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'provenance_gate.py'


def run(tmp_path, claims, evidence):
    c = tmp_path / 'claims.json'
    e = tmp_path / 'evidence.json'
    c.write_text(json.dumps(claims), encoding='utf-8')
    e.write_text(json.dumps(evidence), encoding='utf-8')
    cp = subprocess.run([sys.executable, str(SCRIPT), '--claims', str(c), '--evidence', str(e)], text=True, capture_output=True)
    return cp.returncode, json.loads(cp.stdout)


def test_valid_success(tmp_path):
    claims = [{'id':'c1','kind':'observation-complete','source_id':'chat:123','action':'read'}]
    evidence = [{'id':'e1','source_id':'chat:123','action':'read','status':'succeeded'}]
    code, data = run(tmp_path, claims, evidence)
    assert code == 0
    assert data['claims'][0]['evidence_id'] == 'e1'


def test_failed_attempt_does_not_authorize_claim(tmp_path):
    claims = [{'id':'c1','kind':'observation-complete','source_id':'chat:123','action':'read'}]
    evidence = [{'id':'e1','source_id':'chat:123','action':'read','status':'failed'}]
    code, data = run(tmp_path, claims, evidence)
    assert code == 3
    assert data['verdict'] == 'rewrite-required'


def test_wrong_source_is_blocked(tmp_path):
    claims = [{'id':'c1','kind':'observation-complete','source_id':'chat:123','action':'read'}]
    evidence = [{'id':'e1','source_id':'chat:456','action':'read','status':'succeeded'}]
    code, _ = run(tmp_path, claims, evidence)
    assert code == 3


def test_inference_and_user_provided_are_allowed_without_retrieval(tmp_path):
    claims = [
        {'id':'c1','kind':'inference'},
        {'id':'c2','kind':'user-provided'},
    ]
    code, data = run(tmp_path, claims, [])
    assert code == 0
    assert all(x['verdict'] == 'allow' for x in data['claims'])


def test_missing_evidence_is_blocked(tmp_path):
    claims = [{'id':'c1','kind':'observation-complete','source_id':'file:x','action':'open'}]
    code, _ = run(tmp_path, claims, [])
    assert code == 3

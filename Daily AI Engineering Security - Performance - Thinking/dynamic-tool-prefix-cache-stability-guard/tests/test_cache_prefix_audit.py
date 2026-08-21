import json, subprocess, sys
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"cache_prefix_audit.py"
POLICY=Path(__file__).parents[1]/"config"/"policy.json"

def run(tmp_path, current, previous=None):
    c=tmp_path/"c.json"; c.write_text(json.dumps(current), encoding="utf-8")
    cmd=[sys.executable,str(SCRIPT),str(c),"--policy",str(POLICY)]
    if previous is not None:
        p=tmp_path/"p.json"; p.write_text(json.dumps(previous), encoding="utf-8"); cmd += ["--previous",str(p)]
    return subprocess.run(cmd, capture_output=True, text=True)

def test_order_drift_detected(tmp_path):
    a=[{"name":"a","description":"A"},{"name":"b","description":"B"}]
    b=list(reversed(a))
    r=run(tmp_path,b,a)
    assert r.returncode==3
    assert json.loads(r.stdout)["classification"]=="avoidable_byte_or_order_drift"

def test_semantic_change_allowed(tmp_path):
    a=[{"name":"a","description":"A"}]
    b=[{"name":"a","description":"changed"}]
    r=run(tmp_path,b,a)
    assert r.returncode==0
    assert json.loads(r.stdout)["classification"]=="semantic_catalog_change"

def test_invalid_catalog(tmp_path):
    r=run(tmp_path,[{"description":"missing name"}])
    assert r.returncode==2

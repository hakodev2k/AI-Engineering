import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "audience_guard.py"
POLICY = ROOT / "config" / "policy.json"

def run(e):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/"e.json"; p.write_text(json.dumps(e), encoding="utf-8")
        return subprocess.run([sys.executable,str(SCRIPT),str(p),"--policy",str(POLICY)],capture_output=True,text=True)

def test_good_resource_and_audience_allows():
    r=run({"impact":"write","verified_audiences":["https://mcp.example.com/"],"resource_parameter_supported":True,"resource_parameter_sent":True,"token_kind":"jwt"})
    assert r.returncode==0 and '"decision": "allow"' in r.stdout

def test_wrong_audience_denies():
    r=run({"impact":"read-low","verified_audiences":["https://other.example.com/"],"resource_parameter_supported":True,"resource_parameter_sent":True,"token_kind":"jwt"})
    assert r.returncode==4 and 'deny' in r.stdout

def test_missing_resource_denies_by_default():
    r=run({"impact":"read-low","verified_audiences":["https://mcp.example.com/"],"resource_parameter_supported":False,"resource_parameter_sent":False,"token_kind":"jwt"})
    assert r.returncode==4

def test_unverified_opaque_token_denies():
    r=run({"impact":"read-low","verified_audiences":["https://mcp.example.com/"],"resource_parameter_supported":True,"resource_parameter_sent":True,"token_kind":"opaque","opaque_token_introspection_verified":False})
    assert r.returncode==4

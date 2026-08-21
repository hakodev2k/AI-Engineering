import json, subprocess, sys, tempfile, time
from pathlib import Path
SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "analyze_message.py"

def run(msg):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/"m.json"; p.write_text(json.dumps(msg),encoding="utf-8")
        r=subprocess.run([sys.executable,str(SCRIPT),str(p)],capture_output=True,text=True)
        return r.returncode, json.loads(r.stdout)

def base():
    return {"message_id":"m1","correlation_id":"c1","schema_version":"1","payload":{"name":"ok","token":"secret"},"attempt_count":1,"created_at_epoch":int(time.time())}

def test_transient_is_retryable_pass():
    m=base(); m["last_error"]="timeout calling dependency"
    code,out=run(m)
    assert code==0 and out["status"]=="pass" and out["classification"]=="transient"

def test_poison_after_max_attempts():
    m=base(); m["attempt_count"]=5; m["last_error"]="validation failed"
    code,out=run(m)
    assert code==1 and out["status"]=="quarantine" and out["classification"]=="poison"

def test_missing_metadata_blocks():
    m=base(); del m["schema_version"]
    code,out=run(m)
    assert code==1 and out["status"]=="blocked" and out["classification"]=="schema"

def test_business_rule_quarantines():
    m=base(); m["last_error"]="business rule: invalid state transition"
    code,out=run(m)
    assert code==1 and out["status"]=="quarantine" and out["classification"]=="business-rule"

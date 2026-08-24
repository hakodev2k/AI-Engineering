import json, subprocess, sys, tempfile
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/"scripts"/"ttft_profiler.py"

def call(args, content, name):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/name; p.write_text(content,encoding="utf-8")
        return subprocess.run([sys.executable,str(SCRIPT),*args,str(p)],capture_output=True,text=True)

def test_profile_separates_ttft_from_tool():
    lines=[{"turn_id":1,"event":"request_start","ts_ms":0},{"turn_id":1,"event":"model_first_token","ts_ms":5000},{"turn_id":1,"event":"tool_start","ts_ms":8000},{"turn_id":2,"event":"request_start","ts_ms":0},{"turn_id":2,"event":"model_first_token","ts_ms":1000}]
    r=call(["profile","--trace"],"\n".join(json.dumps(x) for x in lines),"t.jsonl")
    out=json.loads(r.stdout); assert r.returncode==0 and out["max_ttft_ms"]==5000 and out["turns"][0]["first_tool_ms"]==8000

def test_gate_warn_and_block():
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/"s.json"; p.write_text(json.dumps({"history_bytes":150,"recent_ttft_ms":50}),encoding="utf-8")
        r=subprocess.run([sys.executable,str(SCRIPT),"gate","--snapshot",str(p),"--warn-bytes","100","--block-bytes","200","--ttft-slo-ms","1000"],capture_output=True,text=True)
        assert r.returncode==1 and json.loads(r.stdout)["status"]=="WARN"
        p.write_text(json.dumps({"history_bytes":250,"recent_ttft_ms":50}),encoding="utf-8")
        r=subprocess.run([sys.executable,str(SCRIPT),"gate","--snapshot",str(p),"--warn-bytes","100","--block-bytes","200","--ttft-slo-ms","1000"],capture_output=True,text=True)
        assert r.returncode==2 and json.loads(r.stdout)["status"]=="BLOCK"

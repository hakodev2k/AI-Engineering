#!/usr/bin/env python3
import json, subprocess, sys, tempfile, time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; GATE=ROOT/"scripts/semantic_cache_gate.py"; POLICY=ROOT/"config/policy.json"
BASE={"purpose":"faq","tenant":"tenant-a","auth_scope":"public-read","model":"model-a","system_prompt_hash":"system123","toolset_hash":"tools1234","schema_version":"v1","locale":"en","expects_tool_calls":False}
def run(req,entries):
    with tempfile.TemporaryDirectory() as d:
        d=Path(d); rp=d/"r.json"; ep=d/"e.json"; op=d/"o.json"
        rp.write_text(json.dumps(req)); ep.write_text(json.dumps(entries))
        p=subprocess.run([sys.executable,str(GATE),"--request",str(rp),"--entries",str(ep),"--policy",str(POLICY),"--out",str(op)],capture_output=True,text=True)
        if p.returncode!=0: raise AssertionError(p.stderr)
        return json.loads(op.read_text())
def entry(prompt="How do I reset my local development cache?",tenant="tenant-a"):
    return {**BASE,"id":"e1","prompt":prompt,"response":"Use the documented local cache reset command.","tenant":tenant,"created_at":int(time.time())}
def main():
    req={**BASE,"prompt":"How do I reset my local development cache?"}
    assert run(req,[entry()])["decision"]=="hit"
    assert run({**req,"tenant":"tenant-b"},[entry()])["decision"]=="miss"
    assert run({**req,"prompt":"Authorization: Bearer abcdefghijklmnopqrstuvwxyz"},[]) ["decision"]=="bypass"
    assert run({**req,"prompt":"Please delete the production customer record"},[])["decision"]=="bypass"
    assert run({**req,"expects_tool_calls":True},[])["decision"]=="bypass"
    print("PASS: semantic cache isolation and bypass tests")
if __name__=="__main__": main()

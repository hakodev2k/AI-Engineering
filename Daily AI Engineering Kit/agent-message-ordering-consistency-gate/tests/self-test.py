#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile

ROOT=pathlib.Path(__file__).resolve().parents[1]
scanner=ROOT/'scripts'/'scan-ordering-risk.py'
validator=ROOT/'scripts'/'validate-assessment.py'
sample=ROOT/'examples'/'sample-assessment.json'

r=subprocess.run([sys.executable,str(validator),str(sample)],capture_output=True,text=True)
assert r.returncode==0, r.stderr or r.stdout

with tempfile.TemporaryDirectory() as d:
    p=pathlib.Path(d)/'Consumer.cs'
    p.write_text('''public async Task Handle(Message m) { await Task.WhenAll(a(), b()); await Publish(m); }''')
    r=subprocess.run([sys.executable,str(scanner),str(p)],capture_output=True,text=True)
    assert r.returncode in (1,2), r.stdout+r.stderr

bad=json.loads(sample.read_text())
bad['verification']['stale_event']=False
with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False) as f:
    json.dump(bad,f); bad_path=f.name
r=subprocess.run([sys.executable,str(validator),bad_path],capture_output=True,text=True)
assert r.returncode!=0, 'validator accepted incomplete pass verification'
print('self-test passed')

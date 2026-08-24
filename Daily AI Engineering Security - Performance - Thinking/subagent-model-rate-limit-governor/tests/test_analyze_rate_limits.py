import json, subprocess, sys, tempfile
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/'scripts'/'analyze_rate_limits.py'

def run(rows):
    with tempfile.NamedTemporaryFile('w', delete=False, encoding='utf-8') as f:
        for r in rows: f.write(json.dumps(r)+'\n')
        name=f.name
    p=subprocess.run([sys.executable,str(SCRIPT),name,'--json'],capture_output=True,text=True)
    Path(name).unlink(missing_ok=True)
    return p

def row(child,status,lat=100,attempt=1):
    return {'timestamp':'2026-08-24T12:00:00+07:00','child_id':child,'provider':'github','model':'m1','status_code':status,'latency_ms':lat,'attempt':attempt}

def test_healthy_trace_passes():
    p=run([row('a',200),row('b',200)])
    assert p.returncode==0
    assert json.loads(p.stdout)['child_completion_rate']==1.0

def test_throttle_density_blocks():
    p=run([row('a',429),row('a',200,attempt=2),row('b',429),row('b',200,attempt=2)])
    assert p.returncode==1
    data=json.loads(p.stdout)
    assert data['buckets']['github|m1|default']['rate_limited']==2

def test_invalid_trace_errors():
    p=run([{'timestamp':'x'}])
    assert p.returncode==2

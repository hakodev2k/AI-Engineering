import json,subprocess,sys,tempfile
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/'scripts'/'eval_gate.py'
CFG=Path(__file__).parents[1]/'config'/'eval-gate.yaml'

def write(path,score,status='pass',critical=False,latency=100,cost=.01):
 path.write_text(json.dumps({'case_id':'c1','status':status,'dimensions':{'correctness':score,'safety':1,'format':1,'tool_use':1},'critical':critical,'latency_ms':latency,'cost_usd':cost})+'\n')

def run(b,c,o): return subprocess.run([sys.executable,str(SCRIPT),'--baseline',str(b),'--candidate',str(c),'--config',str(CFG),'--out',str(o)],capture_output=True,text=True)

def test_passes_equal_candidate():
 with tempfile.TemporaryDirectory() as d:
  d=Path(d);b=d/'b';c=d/'c';o=d/'o';write(b,1);write(c,1);r=run(b,c,o);assert r.returncode==0;assert json.loads(o.read_text())['status']=='pass'

def test_blocks_critical_failure():
 with tempfile.TemporaryDirectory() as d:
  d=Path(d);b=d/'b';c=d/'c';o=d/'o';write(b,1);write(c,.2,'fail',True);r=run(b,c,o);assert r.returncode==2;assert 'critical regression' in json.loads(o.read_text())['failures']

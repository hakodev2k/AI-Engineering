import json,subprocess,sys,tempfile,unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'ttft_knee.py'
class T(unittest.TestCase):
 def make(self,rows,cfg=None):
  td=tempfile.TemporaryDirectory(); b=Path(td.name); t=b/'t.jsonl'; t.write_text('\n'.join(json.dumps(r) for r in rows)+'\n'); c=b/'c.json'; c.write_text(json.dumps(cfg or {'max_p95_ttft_ms':30000,'bin_size_tokens':20000,'safety_margin_ratio':0.8,'minimum_samples_per_bin':3,'default_soft_budget_tokens':180000})); return td,t,c
 def test_knee_and_gate(self):
  rows=[]
  for tok,tt in [(40000,4000),(40000,5000),(40000,6000),(200000,40000),(200000,45000),(200000,50000)]: rows.append({'input_tokens':tok,'cached_input_tokens':tok//2,'ttft_ms':tt,'model':'m','workload':'code'})
  td,t,c=self.make(rows)
  with td:
   r=subprocess.run([sys.executable,str(SCRIPT),str(t),'--config',str(c),'--gate-tokens','190000','--model','m','--workload','code'],capture_output=True,text=True); self.assertEqual(r.returncode,2); d=json.loads(r.stdout); self.assertEqual(d['groups'][0]['detected_knee_tokens'],200000); self.assertEqual(d['groups'][0]['recommended_soft_budget_tokens'],160000); self.assertFalse(d['gate']['passed'])
 def test_default(self):
  rows=[{'input_tokens':40000+i*1000,'cached_input_tokens':30000,'ttft_ms':5000+i,'model':'m','workload':'code'} for i in range(6)]; td,t,c=self.make(rows)
  with td:
   r=subprocess.run([sys.executable,str(SCRIPT),str(t),'--config',str(c)],capture_output=True,text=True); self.assertEqual(r.returncode,0); self.assertEqual(json.loads(r.stdout)['groups'][0]['recommended_soft_budget_tokens'],180000)
 def test_bad_cache(self):
  td,t,c=self.make([{'input_tokens':10,'cached_input_tokens':20,'ttft_ms':1,'model':'m','workload':'w'}])
  with td:self.assertEqual(subprocess.run([sys.executable,str(SCRIPT),str(t),'--config',str(c)]).returncode,1)
if __name__=='__main__':unittest.main()

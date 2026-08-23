import json,subprocess,sys,tempfile,unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'validate-circuit.py'
class Tests(unittest.TestCase):
 def run_case(self,state,outcomes):
  with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False) as f:
   json.dump({'service':'x','state':state,'observations':[{'timestamp':'2026-01-01T00:00:00Z','outcome':o,'status':503 if 'failure' in o else 200} for o in outcomes],'verification_status':'pending'},f);p=f.name
  return subprocess.run([sys.executable,str(SCRIPT),p],capture_output=True,text=True).returncode
 def test_opens(self): self.assertEqual(0,self.run_case('open',['retryable-failure']*6+['success']*4))
 def test_stays_closed_below_minimum(self): self.assertEqual(0,self.run_case('closed',['retryable-failure']*5))
 def test_detects_wrong_state(self): self.assertEqual(1,self.run_case('closed',['retryable-failure']*10))
if __name__=='__main__': unittest.main()

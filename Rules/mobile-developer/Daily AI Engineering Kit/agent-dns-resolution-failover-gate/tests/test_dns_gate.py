import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'dns_gate.py'
class GateTests(unittest.TestCase):
 def test_localhost_blocked(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'p.json'; o=Path(d)/'o.json'
   p.write_text(json.dumps({'forbidden_ip_ranges':['127.0.0.0/8','::1/128'],'max_addresses_per_host':16,'min_distinct_addresses':1,'max_resolution_seconds':5,'max_retries':0}))
   r=subprocess.run([sys.executable,str(SCRIPT),'--policy',str(p),'--output',str(o),'localhost'],capture_output=True,text=True)
   self.assertEqual(r.returncode,1); self.assertEqual(json.loads(o.read_text())['status'],'failed')
 def test_missing_hosts_is_usage_error(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'p.json'; p.write_text('{}')
   r=subprocess.run([sys.executable,str(SCRIPT),'--policy',str(p)],capture_output=True,text=True)
   self.assertEqual(r.returncode,2)
if __name__=='__main__': unittest.main()

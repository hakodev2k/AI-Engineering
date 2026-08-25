import csv,json,subprocess,sys,tempfile,unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'profile_contention.py'
class T(unittest.TestCase):
 def trace(self,rows):
  td=tempfile.TemporaryDirectory(); p=Path(td.name)/'t.csv'; cols=['timestamp_ms','state','input_latency_ms','cpu_pct','read_mb_s','write_mb_s','rss_mb','event_loop_lag_ms']
  with p.open('w',newline='',encoding='utf-8') as f: w=csv.DictWriter(f,fieldnames=cols); w.writeheader(); w.writerows(rows)
  return td,p
 def test_regression(self):
  rows=[dict(timestamp_ms=0,state='idle',input_latency_ms=4,cpu_pct=5,read_mb_s=2,write_mb_s=1,rss_mb=500,event_loop_lag_ms=2),dict(timestamp_ms=1,state='idle',input_latency_ms=5,cpu_pct=6,read_mb_s=3,write_mb_s=1,rss_mb=510,event_loop_lag_ms=2),dict(timestamp_ms=2,state='active',input_latency_ms=200,cpu_pct=95,read_mb_s=900,write_mb_s=10,rss_mb=900,event_loop_lag_ms=150),dict(timestamp_ms=3,state='active',input_latency_ms=220,cpu_pct=97,read_mb_s=950,write_mb_s=10,rss_mb=920,event_loop_lag_ms=170)]
  td,p=self.trace(rows)
  with td:
   th=Path(td.name)/'th.json'; th.write_text(json.dumps({'input_latency_p95_ms_max':50})); r=subprocess.run([sys.executable,str(SCRIPT),str(p),'--thresholds',str(th)],capture_output=True,text=True); self.assertEqual(r.returncode,2); self.assertFalse(json.loads(r.stdout)['passed'])
 def test_pass(self):
  rows=[dict(timestamp_ms=i,state=('idle' if i<2 else 'active'),input_latency_ms=5+i,cpu_pct=10+i,read_mb_s=5+i,write_mb_s=1,rss_mb=500,event_loop_lag_ms=2+i) for i in range(4)]
  td,p=self.trace(rows)
  with td:
   th=Path(td.name)/'th.json'; th.write_text(json.dumps({'input_latency_p95_ms_max':50})); r=subprocess.run([sys.executable,str(SCRIPT),str(p),'--thresholds',str(th)],capture_output=True,text=True); self.assertEqual(r.returncode,0)
 def test_bad_state(self):
  rows=[dict(timestamp_ms=i,state='bad',input_latency_ms=1,cpu_pct=1,read_mb_s=1,write_mb_s=1,rss_mb=1,event_loop_lag_ms=1) for i in range(3)]; td,p=self.trace(rows)
  with td: self.assertEqual(subprocess.run([sys.executable,str(SCRIPT),str(p)]).returncode,1)
if __name__=='__main__': unittest.main()

import json,subprocess,sys,tempfile,unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'memory_admission.py'
class Tests(unittest.TestCase):
    def run_case(self,size,policy):
        with tempfile.TemporaryDirectory() as d:
            src=Path(d)/'r.jsonl'; pol=Path(d)/'p.json'; src.write_bytes(b'x'*size); pol.write_text(json.dumps(policy)); cp=subprocess.run([sys.executable,str(SCRIPT),'--input',str(src),'--policy',str(pol)],capture_output=True,text=True); return cp.returncode,json.loads(cp.stdout)
    def policy(self): return {'context_window_tokens':100,'reserve_system_tokens':10,'reserve_output_tokens':10,'safety_fraction':1.0,'bytes_per_token_estimate':2.0,'chunk_overlap_tokens':5}
    def test_small_admitted(self):
        rc,o=self.run_case(100,self.policy()); self.assertEqual(rc,0); self.assertEqual(o['decision'],'admit')
    def test_large_rechunked(self):
        rc,o=self.run_case(500,self.policy()); self.assertEqual(rc,2); self.assertEqual(o['decision'],'rechunk'); self.assertGreater(len(o['chunks']),1)
    def test_chunks_progress_and_cover_end(self):
        rc,o=self.run_case(500,self.policy()); c=o['chunks']; self.assertTrue(all(c[i]['start_byte']<c[i]['end_byte'] for i in range(len(c)))); self.assertEqual(c[-1]['end_byte'],500)
if __name__=='__main__': unittest.main()

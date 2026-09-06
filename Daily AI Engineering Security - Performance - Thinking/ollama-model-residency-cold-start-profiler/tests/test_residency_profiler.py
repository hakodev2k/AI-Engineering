import json, os, subprocess, sys, tempfile, unittest

SCRIPT=os.path.join(os.path.dirname(__file__),"..","scripts","residency_profiler.py")

class ProfilerTests(unittest.TestCase):
    def write_trace(self, path, cold_every=5):
        with open(path,"w",encoding="utf-8") as f:
            for i in range(20):
                load=1000 if i % cold_every == 0 else 20
                row={"timestamp":1700000000+i*60,"model":"test","total_duration_ms":load+500,"load_duration_ms":load}
                f.write(json.dumps(row)+"\n")
    def test_valid_trace(self):
        with tempfile.TemporaryDirectory() as d:
            p=os.path.join(d,"t.jsonl"); self.write_trace(p)
            r=subprocess.run([sys.executable,SCRIPT,p],capture_output=True,text=True)
            self.assertEqual(r.returncode,0,r.stderr)
            data=json.loads(r.stdout)
            self.assertEqual(data["baseline"]["sample_count"],20)
            self.assertGreater(data["baseline"]["cold_start_rate"],0)
    def test_small_trace_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            p=os.path.join(d,"t.jsonl")
            with open(p,"w",encoding="utf-8") as f:
                f.write(json.dumps({"timestamp":1,"model":"x","total_duration_ms":100,"load_duration_ms":10})+"\n")
            r=subprocess.run([sys.executable,SCRIPT,p],capture_output=True,text=True)
            self.assertEqual(r.returncode,3)

if __name__=="__main__": unittest.main()

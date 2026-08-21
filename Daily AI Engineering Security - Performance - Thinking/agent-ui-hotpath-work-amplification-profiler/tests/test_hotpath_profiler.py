import importlib.util,pathlib,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("p",ROOT/"scripts"/"hotpath_profiler.py"); p=importlib.util.module_from_spec(spec); spec.loader.exec_module(p)
class Tests(unittest.TestCase):
    def test_no_copy_no_redundant_wakeup(self):
        r=p.analyze([{"payload_bytes":1000,"clone_count":0,"subscriber_count":2,"state_changed":True,"duration_ms":2}]); self.assertEqual(r["total_clone_bytes"],0); self.assertEqual(r["redundant_wakeup_ratio"],0)
    def test_clone_accounting(self):
        r=p.analyze([{"payload_bytes":100,"clone_count":3,"subscriber_count":0,"state_changed":True,"duration_ms":1}]); self.assertEqual(r["total_clone_bytes"],300)
    def test_unchanged_wakeup_is_redundant(self):
        r=p.analyze([{"payload_bytes":1,"clone_count":0,"subscriber_count":4,"state_changed":False,"duration_ms":1},{"payload_bytes":1,"clone_count":0,"subscriber_count":4,"state_changed":True,"duration_ms":1}]); self.assertEqual(r["redundant_wakeups"],4); self.assertEqual(r["redundant_wakeup_ratio"],0.5)
    def test_p95(self):
        ev=[{"payload_bytes":1,"clone_count":0,"subscriber_count":0,"state_changed":True,"duration_ms":x} for x in range(1,21)]; self.assertEqual(p.analyze(ev)["p95_duration_ms"],19)
    def test_invalid(self):
        with self.assertRaises(ValueError): p.analyze([{"payload_bytes":-1,"clone_count":0,"subscriber_count":0,"state_changed":True,"duration_ms":1}])
if __name__=="__main__": unittest.main()

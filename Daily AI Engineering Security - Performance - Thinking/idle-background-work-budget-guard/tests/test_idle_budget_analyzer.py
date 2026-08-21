import importlib.util, pathlib, tempfile, unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "idle_budget_analyzer.py"
spec = importlib.util.spec_from_file_location("idle_budget_analyzer", MODULE)
iba = importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(iba)

class IdleBudgetTests(unittest.TestCase):
    def csv(self, body):
        f=tempfile.NamedTemporaryFile("w",encoding="utf-8",delete=False)
        with f: f.write("timestamp_s,cpu_seconds,rss_bytes,read_bytes,write_bytes\n"+body)
        return f.name

    def test_metrics(self):
        rows=iba.load(self.csv("0,10,104857600,0,0\n60,20,115343360,1048576,1048576\n"))
        m=iba.analyze(rows)
        self.assertAlmostEqual(m["core_seconds_per_minute"],10.0)
        self.assertAlmostEqual(m["rss_growth_mb_per_minute"],10.0)
        self.assertAlmostEqual(m["io_mb_per_minute"],2.0)

    def test_rejects_non_monotonic_time(self):
        with self.assertRaises(ValueError):
            iba.load(self.csv("1,1,1,0,0\n1,2,2,0,0\n"))

    def test_rejects_cpu_counter_reset(self):
        with self.assertRaises(ValueError):
            iba.load(self.csv("0,2,1,0,0\n60,1,2,0,0\n"))

if __name__=="__main__": unittest.main()

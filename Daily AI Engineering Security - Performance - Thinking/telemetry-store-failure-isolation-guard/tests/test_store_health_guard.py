import importlib.util, pathlib, tempfile, unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "store_health_guard.py"
spec = importlib.util.spec_from_file_location("store_health_guard", MODULE)
shg = importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(shg)

class StoreHealthGuardTests(unittest.TestCase):
    def test_noncritical_over_budget_is_isolated(self):
        with tempfile.NamedTemporaryFile() as f:
            result = shg.evaluate({"name":"logs","path":f.name,"critical":False,"max_init_ms":100,"init_ms":500,"health":"ok"}, 1024)
            self.assertEqual(result["action"], "isolate")

    def test_critical_health_error_blocks(self):
        with tempfile.NamedTemporaryFile() as f:
            result = shg.evaluate({"name":"state","path":f.name,"critical":True,"health":"error"}, 1024)
            self.assertEqual(result["action"], "block")

    def test_retry_circuit_isolates_noncritical(self):
        with tempfile.NamedTemporaryFile() as f:
            result = shg.evaluate({"name":"logs","path":f.name,"critical":False,"health":"ok","identical_retry_count":2}, 1024)
            self.assertEqual(result["action"], "isolate")

if __name__ == "__main__": unittest.main()

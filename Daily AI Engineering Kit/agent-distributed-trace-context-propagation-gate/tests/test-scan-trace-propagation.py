import importlib.util, pathlib, unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "scan-trace-propagation.py"
spec = importlib.util.spec_from_file_location("scan_trace", SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
CFG={"boundary_patterns":["HttpClient","publish","worker"],"propagation_patterns":["traceparent","Inject","Extract","ActivityContext"]}

class ScanTests(unittest.TestCase):
    def test_boundary_without_signal_is_high(self):
        fs=mod.analyze_text("a.cs", "var c = new HttpClient();", CFG)
        self.assertTrue(any(f["rule"]=="boundary-without-propagation-signal" and f["severity"]=="high" for f in fs))
    def test_boundary_with_injection_not_high_for_missing_signal(self):
        fs=mod.analyze_text("a.cs", "HttpClient client; propagator.Inject(context, request);", CFG)
        self.assertFalse(any(f["rule"]=="boundary-without-propagation-signal" for f in fs))
    def test_consumer_root_risk(self):
        fs=mod.analyze_text("worker.cs", "worker Consume message; tracer.StartActivity(\"consume\");", CFG)
        self.assertTrue(any(f["rule"]=="consumer-root-span-risk" for f in fs))
    def test_manual_header_is_medium(self):
        fs=mod.analyze_text("x.py", "headers['traceparent'] = value", CFG)
        self.assertTrue(any(f["rule"]=="manual-trace-header-handling" and f["severity"]=="medium" for f in fs))

if __name__ == "__main__": unittest.main()

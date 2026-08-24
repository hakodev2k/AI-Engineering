import importlib.util, json, tempfile, unittest
from pathlib import Path

P=Path(__file__).resolve().parents[1]/"scripts"/"usage_accounting_guard.py"
spec=importlib.util.spec_from_file_location("uag",P); g=importlib.util.module_from_spec(spec); spec.loader.exec_module(g)

class AccountingTests(unittest.TestCase):
    def test_advisor_rollup_uses_final_message_for_context(self):
        u={"input_tokens":4,"cache_creation_input_tokens":3249,"cache_read_input_tokens":1031027,"iterations":[
            {"type":"message","input_tokens":2,"cache_creation_input_tokens":783,"cache_read_input_tokens":515122},
            {"type":"advisor_message","input_tokens":516328},
            {"type":"message","input_tokens":2,"cache_creation_input_tokens":2466,"cache_read_input_tokens":515905}]}
        d=g.analyze_usage(u)
        self.assertEqual(d["apparent_input"],1034280)
        self.assertEqual(d["final_context_input"],518373)
        self.assertGreater(d["inflation_ratio"],1.9)

    def test_single_iteration_is_not_inflated(self):
        u={"input_tokens":100,"cache_read_input_tokens":900,"iterations":[{"type":"message","input_tokens":100,"cache_read_input_tokens":900}]}
        d=g.analyze_usage(u)
        self.assertEqual(d["apparent_input"],1000); self.assertEqual(d["final_context_input"],1000)

    def test_jsonl_loader(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/"x.jsonl"; p.write_text(json.dumps({"usage":{"input_tokens":7}})+"\n"+json.dumps({"usage":{"input_tokens":8}}))
            self.assertEqual(len(g.load_records(p)),2)

if __name__=="__main__": unittest.main()

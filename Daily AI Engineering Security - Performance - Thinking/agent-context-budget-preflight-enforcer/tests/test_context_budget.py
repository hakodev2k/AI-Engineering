import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"context_budget.py"
spec=importlib.util.spec_from_file_location("budget",P); b=importlib.util.module_from_spec(spec); spec.loader.exec_module(b)
POL={"context_window_tokens":1000,"reserved_output_tokens":200,"safety_margin_tokens":100,"reducible_priorities":["low","medium"],"protected_kinds":["system","current_user","required_evidence"]}

class BudgetTests(unittest.TestCase):
    def test_allow(self):
        ctx={"components":[{"name":"sys","kind":"system","tokens":100,"critical":True},{"name":"user","kind":"current_user","tokens":200,"critical":True}]}
        self.assertEqual(b.analyze(ctx,POL)[1],0)
    def test_reduce(self):
        ctx={"components":[{"name":"sys","kind":"system","tokens":200,"critical":True},{"name":"old-tools","kind":"tool_results","tokens":600,"priority":"low","reloadable":True}]}
        out,code=b.analyze(ctx,POL); self.assertEqual(code,3); self.assertEqual(out["decision"],"reduce")
    def test_block_when_protected_exceeds(self):
        ctx={"components":[{"name":"evidence","kind":"required_evidence","tokens":800,"critical":True}]}
        out,code=b.analyze(ctx,POL); self.assertEqual(code,3); self.assertEqual(out["decision"],"block")
    def test_invalid_negative_tokens(self):
        with self.assertRaises(ValueError): b.analyze({"components":[{"name":"x","kind":"history","tokens":-1}]},POL)
    def test_output_reserve_counts(self):
        ctx={"components":[{"name":"x","kind":"history","tokens":750,"priority":"low"}]}
        out,_=b.analyze(ctx,POL); self.assertEqual(out["usable_input_budget"],700)

if __name__=="__main__": unittest.main()

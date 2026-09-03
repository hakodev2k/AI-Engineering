import importlib.util, pathlib, unittest
SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"resume_contract_check.py"
spec=importlib.util.spec_from_file_location("resume_contract_check",SCRIPT); mod=importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(mod)

class ResumeContractTests(unittest.TestCase):
    def test_missing_runtime_only_required_input_blocks(self):
        r={"dependencies":[{"name":"session","kind":"runtime-only","required":True,"available":False}]}
        self.assertFalse(mod.evaluate(r)["ok"])
    def test_reconstructable_inputs_pass_with_matching_fingerprint(self):
        deps=[{"name":"client","kind":"reconstructable","available":True,"value_descriptor":{"endpoint":"a","tenant":"t"}}]
        expected=mod.fingerprint({"client":{"endpoint":"a","tenant":"t"}})
        self.assertTrue(mod.evaluate({"dependencies":deps,"original_fingerprint":expected})["ok"])
    def test_fingerprint_drift_blocks(self):
        deps=[{"name":"client","kind":"reconstructable","available":True,"value_descriptor":{"endpoint":"b"}}]
        self.assertFalse(mod.evaluate({"dependencies":deps,"original_fingerprint":"deadbeef"})["ok"])
    def test_completed_nonidempotent_side_effect_blocks(self):
        r={"dependencies":[],"completed":True,"side_effecting":True,"idempotent":False}
        self.assertTrue(mod.evaluate(r)["duplicate_side_effect_risk"])
        self.assertFalse(mod.evaluate(r)["ok"])

if __name__=="__main__": unittest.main()

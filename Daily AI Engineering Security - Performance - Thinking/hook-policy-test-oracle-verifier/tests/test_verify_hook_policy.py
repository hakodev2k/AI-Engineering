import json, tempfile, unittest
from pathlib import Path
from scripts.verify_hook_policy import decision_from_output, load_cases, compare, load_observations

class VerifyHookPolicyTests(unittest.TestCase):
    def temp(self,text):
        f=tempfile.NamedTemporaryFile("w",delete=False,encoding="utf-8"); f.write(text); f.close(); self.addCleanup(lambda:Path(f.name).unlink(missing_ok=True)); return Path(f.name)

    def test_exit_two_is_deny(self):
        self.assertEqual(decision_from_output(2,""),"deny")

    def test_json_ask(self):
        out=json.dumps({"hookSpecificOutput":{"permissionDecision":"ask"}})
        self.assertEqual(decision_from_output(0,out),"ask")

    def test_empty_success_is_defer_not_pass(self):
        self.assertEqual(decision_from_output(0,""),"defer")

    def test_missing_observation_fails_compare(self):
        cases=[{"id":"deny-x","expected":"deny","input":{}}]
        rows,failed=compare(cases,{})
        self.assertTrue(failed); self.assertIsNone(rows[0]["actual"])

    def test_case_and_observation_load(self):
        cpath=self.temp('[{"id":"deny-x","expected":"deny","input":{"tool":"Write"}}]')
        opath=self.temp('{"id":"deny-x","actual":"deny"}\n')
        cases=load_cases(cpath); obs=load_observations(opath); rows,failed=compare(cases,obs)
        self.assertFalse(failed); self.assertTrue(rows[0]["ok"])

    def test_duplicate_case_rejected(self):
        path=self.temp('[{"id":"x","expected":"deny","input":{}},{"id":"x","expected":"allow","input":{}}]')
        with self.assertRaises(ValueError): load_cases(path)

if __name__=="__main__": unittest.main()

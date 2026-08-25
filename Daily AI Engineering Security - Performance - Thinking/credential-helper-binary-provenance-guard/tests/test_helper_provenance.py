import importlib.util, os, pathlib, stat, tempfile, unittest

P=pathlib.Path(__file__).parents[1]/"scripts"/"helper_provenance.py"
spec=importlib.util.spec_from_file_location("guard",P); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)

class ProvenanceTests(unittest.TestCase):
    def make_exec(self, directory, name):
        p=pathlib.Path(directory)/name
        p.write_text("#!/bin/sh\nexit 0\n",encoding="utf-8")
        p.chmod(p.stat().st_mode | stat.S_IXUSR)
        return str(p)

    def test_exact_path_verified(self):
        with tempfile.TemporaryDirectory() as d:
            p=self.make_exec(d,"security")
            x=guard.check_helper({"name":"k","expected_path":p,"check_path_shadowing":True},{"PATH":d})
            self.assertEqual(x["status"],"verified")

    def test_shadow_binary_blocked(self):
        with tempfile.TemporaryDirectory() as trusted, tempfile.TemporaryDirectory() as shadow:
            expected=self.make_exec(trusted,"security")
            self.make_exec(shadow,"security")
            x=guard.check_helper({"name":"k","expected_path":expected,"check_path_shadowing":True},{"PATH":shadow+os.pathsep+trusted})
            self.assertIn("path_shadow_mismatch",x["violations"])

    def test_relative_policy_invalid(self):
        x=guard.check_helper({"name":"k","expected_path":"security"},{"PATH":""})
        self.assertEqual(x["status"],"invalid")

    def test_hash_mismatch_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            p=self.make_exec(d,"security")
            x=guard.check_helper({"name":"k","expected_path":p,"sha256":"0"*64,"check_path_shadowing":False},{"PATH":d})
            self.assertIn("sha256_mismatch",x["violations"])

if __name__=="__main__": unittest.main()

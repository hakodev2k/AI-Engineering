import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/"scripts"/"verify_postconditions.py"

class Tests(unittest.TestCase):
    def run_case(self,pre,post,expect):
        with tempfile.TemporaryDirectory() as d:
            paths=[]
            for name,obj in [("pre",pre),("post",post),("expect",expect)]:
                p=Path(d)/(name+".json"); p.write_text(json.dumps(obj),encoding="utf-8"); paths.append(p)
            return subprocess.run([sys.executable,str(SCRIPT),"--pre",str(paths[0]),"--post",str(paths[1]),"--expect",str(paths[2])],capture_output=True,text=True)

    def test_verified_success(self):
        r=self.run_case({"resource_id":"x","status":"active"},{"resource_id":"x","status":"archived"},{"required":[{"path":"status","op":"eq","value":"archived"}]})
        self.assertEqual(r.returncode,0); self.assertIn("verified-success",r.stdout)

    def test_verified_failure(self):
        r=self.run_case({"resource_id":"x"},{"resource_id":"x","status":"active"},{"required":[{"path":"status","op":"eq","value":"archived"}]})
        self.assertEqual(r.returncode,2)

    def test_indeterminate_missing_observation(self):
        r=self.run_case({"resource_id":"x"},{"resource_id":"x"},{"required":[{"path":"status","op":"eq","value":"archived"}]})
        self.assertEqual(r.returncode,4)

    def test_resource_mismatch_indeterminate(self):
        r=self.run_case({"resource_id":"x"},{"resource_id":"y","status":"archived"},{"required":[{"path":"status","op":"eq","value":"archived"}]})
        self.assertEqual(r.returncode,4)

if __name__=="__main__": unittest.main()

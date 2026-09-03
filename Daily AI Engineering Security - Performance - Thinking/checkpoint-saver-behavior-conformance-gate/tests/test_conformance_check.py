import importlib.util, json, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("cc", ROOT/"scripts"/"conformance_check.py")
cc=importlib.util.module_from_spec(spec); spec.loader.exec_module(cc)

class ConformanceTests(unittest.TestCase):
    def test_profile_fixture_shape(self):
        profile=json.loads((ROOT/"config"/"invariants.json").read_text())
        self.assertIn("metadata_round_trip", profile["required"])
        self.assertTrue(profile["require_sync_async_parity"])

    def test_load_rejects_missing_file(self):
        with self.assertRaises(ValueError): cc.load(ROOT/"tests"/"does-not-exist.json")

if __name__=="__main__": unittest.main()

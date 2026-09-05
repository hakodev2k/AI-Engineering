import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "check_cache_policy.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)
REQ = ["server_id", "tenant_id", "principal_id", "authz_fingerprint"]


class CachePolicyTests(unittest.TestCase):
    def test_blocks_public_sensitive(self):
        e = {"name":"x","scope":"public","sensitivity_known":True,"authenticated":True,"contains_instructions":False,"cache_key_fields":[]}
        self.assertTrue(any("sensitive" in x for x in guard.inspect_entry(e, 0, REQ)))

    def test_blocks_public_instructions(self):
        e = {"name":"x","scope":"public","sensitivity_known":True,"authenticated":False,"contains_instructions":True,"cache_key_fields":[]}
        self.assertTrue(any("instruction" in x for x in guard.inspect_entry(e, 0, REQ)))

    def test_blocks_missing_private_partition(self):
        e = {"name":"x","scope":"private","sensitivity_known":True,"tenant_scoped":True,"contains_instructions":False,"cache_key_fields":["server_id"]}
        self.assertTrue(any("partition" in x for x in guard.inspect_entry(e, 0, REQ)))

    def test_allows_fully_partitioned_private(self):
        e = {"name":"x","scope":"private","sensitivity_known":True,"authenticated":True,"tenant_scoped":True,"user_scoped":True,"permission_sensitive":True,"contains_instructions":False,"cache_key_fields":REQ}
        self.assertEqual([], guard.inspect_entry(e, 0, REQ))

    def test_unknown_sensitivity_fails_closed(self):
        e = {"name":"x","scope":"private","sensitivity_known":False,"cache_key_fields":REQ}
        self.assertTrue(any("unknown" in x for x in guard.inspect_entry(e, 0, REQ)))


if __name__ == "__main__":
    unittest.main()

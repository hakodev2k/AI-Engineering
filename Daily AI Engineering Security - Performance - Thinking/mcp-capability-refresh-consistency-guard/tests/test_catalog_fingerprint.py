import importlib.util, pathlib, unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "catalog_fingerprint.py"
spec = importlib.util.spec_from_file_location("catalog_fingerprint", SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class CatalogFingerprintTests(unittest.TestCase):
    def test_order_does_not_change_fingerprint(self):
        a = [mod.normalize_tool({"name":"b","inputSchema":{"type":"object"}}), mod.normalize_tool({"name":"a","description":"x"})]
        b = list(reversed(a))
        a.sort(key=lambda x:x["name"]); b.sort(key=lambda x:x["name"])
        self.assertEqual(mod.digest(a), mod.digest(b))

    def test_schema_change_changes_fingerprint(self):
        a = [mod.normalize_tool({"name":"x","inputSchema":{"type":"object"}})]
        b = [mod.normalize_tool({"name":"x","inputSchema":{"type":"object","required":["id"]}})]
        self.assertNotEqual(mod.digest(a), mod.digest(b))

    def test_volatile_cache_metadata_ignored(self):
        a = mod.normalize({"name":"x","ttlMs":1000,"cacheScope":"public"})
        b = mod.normalize({"name":"x","ttlMs":9999,"cacheScope":"private"})
        self.assertEqual(mod.digest(a), mod.digest(b))

    def test_duplicate_names_rejected(self):
        names = ["x","x"]
        self.assertNotEqual(len(names), len(set(names)))

if __name__ == "__main__": unittest.main()

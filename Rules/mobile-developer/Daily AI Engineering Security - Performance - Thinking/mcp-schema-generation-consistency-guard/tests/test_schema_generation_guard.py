import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "schema_generation_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class SchemaGenerationGuardTests(unittest.TestCase):
    def test_generation_is_stable_across_tool_order(self):
        a = {"tools": [
            {"name": "b", "outputSchema": {"type": "object", "properties": {"x": {"type": "string"}}}},
            {"name": "a", "inputSchema": {"type": "object"}},
        ]}
        b = {"tools": list(reversed(a["tools"]))}
        self.assertEqual(guard.normalize_catalog(a)["generation_sha256"], guard.normalize_catalog(b)["generation_sha256"])

    def test_schema_change_changes_generation(self):
        a = {"tools": [{"name": "x", "outputSchema": {"type": "string"}}]}
        b = {"tools": [{"name": "x", "outputSchema": {"type": "number"}}]}
        self.assertNotEqual(guard.normalize_catalog(a)["generation_sha256"], guard.normalize_catalog(b)["generation_sha256"])

    def test_duplicate_tool_is_rejected(self):
        with self.assertRaises(ValueError):
            guard.normalize_catalog({"tools": [{"name": "x"}, {"name": "x"}]})

    def test_invalid_output_schema_shape_is_rejected(self):
        with self.assertRaises(ValueError):
            guard.normalize_catalog({"tools": [{"name": "x", "outputSchema": "not-an-object"}]})

    def test_manifest_contains_output_schema_digest(self):
        m = guard.normalize_catalog({"tools": [{"name": "x", "outputSchema": {"type": "object"}}]})
        self.assertTrue(m["tools"][0]["has_output_schema"])
        self.assertEqual(len(m["tools"][0]["output_schema_sha256"]), 64)


if __name__ == "__main__":
    unittest.main()

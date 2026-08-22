import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "cache_prefix_guard.py"
spec = importlib.util.spec_from_file_location("cache_prefix_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)

POLICY = {
    "policy_version": "test",
    "max_tool_schema_growth_percent": 10.0,
    "max_stable_prefix_shrink_percent": 5.0,
    "require_stable_prefix_match": True,
    "volatile_name_patterns": ["timestamp", "request_id", "uuid"],
    "required_component_names": ["system_policy", "tools"],
    "token_estimate_chars_per_token": 4.0,
}


def manifest(system="policy", tools=None, extra=None):
    if tools is None:
        tools = [{"name": "read", "parameters": {"type": "object", "properties": {}}}]
    components = [
        {"name": "system_policy", "stability": "stable", "content": system},
        {"name": "tools", "stability": "stable", "content": tools},
    ]
    if extra:
        components.extend(extra)
    return {"components": components}


class CachePrefixGuardTests(unittest.TestCase):
    def test_equivalent_object_key_order_is_canonical(self):
        a = manifest(tools=[{"name": "x", "schema": {"b": 2, "a": 1}}])
        b = manifest(tools=[{"schema": {"a": 1, "b": 2}, "name": "x"}])
        pa = mod.profile(a, POLICY)
        pb = mod.profile(b, POLICY)
        self.assertEqual(pa["stable_prefix_sha256"], pb["stable_prefix_sha256"])

    def test_stable_prefix_change_fails(self):
        base = mod.profile(manifest(system="policy-v1"), POLICY)
        cur = mod.profile(manifest(system="policy-v2"), POLICY)
        failures, _ = mod.compare(cur, base, POLICY)
        self.assertIn("stable_prefix_hash_changed", failures)

    def test_tool_schema_growth_threshold(self):
        base = mod.profile(manifest(tools=[{"n": "x"}]), POLICY)
        cur = mod.profile(manifest(tools=[{"n": "x", "description": "z" * 100}]), POLICY)
        failures, deltas = mod.compare(cur, base, POLICY)
        self.assertIn("tool_schema_growth_exceeded", failures)
        self.assertGreater(deltas["tool_schema_growth_percent"], 10)

    def test_volatile_before_later_stable_is_flagged(self):
        m = manifest(extra=[
            {"name": "request_id", "stability": "volatile", "content": "abc"},
            {"name": "reference_docs", "stability": "stable", "content": "static docs"},
        ])
        report = mod.profile(m, POLICY)
        self.assertEqual(report["stable_after_volatile"], ["reference_docs"])

    def test_stable_component_with_volatile_name_is_flagged(self):
        m = manifest(extra=[{"name": "timestamp", "stability": "stable", "content": "2026-08-22T16:00:00+07:00"}])
        report = mod.profile(m, POLICY)
        self.assertIn("timestamp", report["stable_named_like_volatile"])

    def test_conditionally_stable_closes_guaranteed_prefix(self):
        m = manifest(extra=[
            {"name": "memory", "stability": "conditionally-stable", "content": "summary"},
            {"name": "later", "stability": "stable", "content": "x"},
        ])
        report = mod.profile(m, POLICY)
        names = [c["name"] for c in report["components"]]
        self.assertIn("later", names)
        # Guaranteed prefix fingerprint remains based only on leading stable components.
        baseline = mod.profile(manifest(), POLICY)
        self.assertEqual(report["stable_prefix_sha256"], baseline["stable_prefix_sha256"])

    def test_missing_required_component_invalid(self):
        with self.assertRaises(ValueError):
            mod.profile({"components": [{"name": "system_policy", "stability": "stable", "content": "x"}]}, POLICY)


if __name__ == "__main__":
    unittest.main()

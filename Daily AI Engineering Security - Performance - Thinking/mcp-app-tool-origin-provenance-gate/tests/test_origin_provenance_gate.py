import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "origin_provenance_gate.py"
spec = importlib.util.spec_from_file_location("gate", SCRIPT)
gate = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(gate)


def rec(origin, visibility, sensitive=False, allowed=None, claimed=None):
    tool = {"name": "mutate", "visibility": visibility, "sensitive": sensitive}
    if allowed is not None:
        tool["allowed_origins"] = allowed
    value = {"host_attested_origin": origin, "tool": tool}
    if claimed is not None:
        value["caller_claimed_origin"] = claimed
    return value


class OriginGateTests(unittest.TestCase):
    def test_app_visible_app_allowed(self):
        self.assertTrue(gate.evaluate(rec("app", ["app"]))["allow"])

    def test_app_only_tool_blocks_model(self):
        self.assertFalse(gate.evaluate(rec("model", ["app"]))["allow"])

    def test_sensitive_dual_visible_unknown_blocks(self):
        self.assertFalse(gate.evaluate(rec("unknown", ["app", "model"], sensitive=True))["allow"])

    def test_forged_caller_marker_is_ignored(self):
        report = gate.evaluate(rec("model", ["app", "model"], claimed="app"))
        self.assertTrue(report["allow"])
        self.assertEqual(report["trusted_origin"], "model")
        self.assertGreaterEqual(len(report["warnings"]), 2)

    def test_stricter_allowed_origins_blocks(self):
        self.assertFalse(gate.evaluate(rec("model", ["app", "model"], allowed=["app"]))["allow"])


if __name__ == "__main__":
    unittest.main()

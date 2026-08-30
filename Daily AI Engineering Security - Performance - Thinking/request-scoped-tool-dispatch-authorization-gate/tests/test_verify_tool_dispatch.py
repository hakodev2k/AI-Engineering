import importlib.util
import pathlib
import unittest

MODULE_PATH = pathlib.Path(__file__).parents[1] / "scripts" / "verify_tool_dispatch.py"
spec = importlib.util.spec_from_file_location("verify_tool_dispatch", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class DispatchGateTests(unittest.TestCase):
    def setUp(self):
        self.policy = {
            "case_sensitive_tool_names": True,
            "aliases": {"refund": "payments.refund"},
            "sensitive_tools": ["admin.delete_user", "payments.refund"],
            "require_human_approval_for": ["admin.delete_user"],
        }

    def test_blocks_executed_unadvertised_tool(self):
        report = mod.evaluate([{
            "request_id": "r1",
            "advertised_tools": ["search"],
            "requested_tool": "admin.delete_user",
            "resolved_tool": "admin.delete_user",
            "callback_executed": True,
            "approved": True,
        }], self.policy)
        self.assertFalse(report["ok"])
        self.assertTrue(any("UNADVERTISED_TOOL" in v["reasons"] for v in report["violations"]))

    def test_authorized_control_passes(self):
        report = mod.evaluate([{
            "request_id": "r2",
            "advertised_tools": ["search"],
            "requested_tool": "search",
            "resolved_tool": "search",
            "callback_executed": True,
        }], self.policy)
        self.assertTrue(report["ok"])

    def test_alias_and_approval_are_enforced(self):
        report = mod.evaluate([{
            "request_id": "r3",
            "advertised_tools": ["admin.delete_user"],
            "requested_tool": "admin.delete_user",
            "resolved_tool": "admin.delete_user",
            "callback_executed": True,
            "approved": False,
        }], self.policy)
        self.assertFalse(report["ok"])

    def test_tenant_mismatch_blocks_execution(self):
        report = mod.evaluate([{
            "request_id": "r4",
            "advertised_tools": ["search"],
            "requested_tool": "search",
            "callback_executed": True,
            "tenant": "tenant-b",
            "authorized_tenant": "tenant-a",
        }], self.policy)
        self.assertFalse(report["ok"])


if __name__ == "__main__":
    unittest.main()

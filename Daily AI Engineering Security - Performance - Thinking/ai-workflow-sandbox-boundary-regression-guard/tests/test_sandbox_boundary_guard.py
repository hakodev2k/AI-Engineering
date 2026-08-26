import unittest
from scripts.sandbox_boundary_guard import evaluate

POLICY = {
    "minimum_versions": {"n8n": [1, 123, 73], "flowise": [3, 1, 3], "agenta": [0, 48, 1]},
    "required_controls_for_custom_code": ["isolated_worker", "low_privilege_os_user", "module_allowlist", "network_egress_policy", "filesystem_write_policy"],
    "forbidden_capabilities": ["host_process_access", "host_global_constructor_access", "unrestricted_module_imports", "shared_privileged_worker"],
    "block_on_unknown_version": True,
}

SAFE_CONTROLS = ["isolated_worker", "low_privilege_os_user", "module_allowlist", "network_egress_policy", "filesystem_write_policy"]


class SandboxBoundaryGuardTests(unittest.TestCase):
    def test_safe_inventory_passes(self):
        inv = {"components": [{"name": "n8n", "version": "2.36.2", "custom_code_enabled": True, "controls": SAFE_CONTROLS, "capabilities": []}]}
        self.assertTrue(evaluate(inv, POLICY)["ok"])

    def test_vulnerable_version_blocks(self):
        inv = {"components": [{"name": "flowise", "version": "3.1.2", "custom_code_enabled": False, "controls": [], "capabilities": []}]}
        r = evaluate(inv, POLICY)
        self.assertFalse(r["ok"])
        self.assertIn("known_vulnerable_version:flowise:3.1.2", r["violations"])

    def test_missing_control_blocks(self):
        inv = {"components": [{"name": "agenta", "version": "0.48.1", "custom_code_enabled": True, "controls": ["isolated_worker"], "capabilities": []}]}
        self.assertFalse(evaluate(inv, POLICY)["ok"])

    def test_forbidden_capability_blocks(self):
        inv = {"components": [{"name": "n8n", "version": "2.36.2", "custom_code_enabled": True, "controls": SAFE_CONTROLS, "capabilities": ["host_process_access"]}]}
        self.assertFalse(evaluate(inv, POLICY)["ok"])


if __name__ == "__main__":
    unittest.main()

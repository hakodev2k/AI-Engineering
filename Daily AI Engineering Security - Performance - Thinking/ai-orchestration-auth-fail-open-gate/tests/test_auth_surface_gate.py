import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "auth_surface_gate.py"
spec = importlib.util.spec_from_file_location("auth_surface_gate", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)


def surface(**overrides):
    base = {
        "name": "x",
        "auth_mode": "required",
        "route_match": "exact",
        "critical": True,
        "directly_reachable": True,
        "exposed": True,
        "anonymous_exemption": False,
        "fail_open": False,
    }
    base.update(overrides)
    return base


class AuthSurfaceGateTests(unittest.TestCase):
    def test_required_auth_passes(self):
        errors, findings = mod.inspect_surface(surface(), 0)
        self.assertEqual([], errors)
        self.assertEqual([], findings)

    def test_critical_none_blocks(self):
        _, findings = mod.inspect_surface(surface(auth_mode="none"), 0)
        self.assertTrue(any("does not require" in x for x in findings))

    def test_optional_blocks(self):
        _, findings = mod.inspect_surface(surface(auth_mode="optional"), 0)
        self.assertTrue(findings)

    def test_upstream_direct_bypass_blocks(self):
        _, findings = mod.inspect_surface(surface(auth_mode="upstream"), 0)
        self.assertTrue(any("directly reachable" in x for x in findings))

    def test_prefix_anonymous_exemption_blocks(self):
        _, findings = mod.inspect_surface(surface(route_match="prefix", anonymous_exemption=True), 0)
        self.assertTrue(any("prefix-based" in x for x in findings))

    def test_noncritical_health_can_be_anonymous(self):
        errors, findings = mod.inspect_surface(surface(auth_mode="none", critical=False), 0)
        self.assertEqual([], errors)
        self.assertEqual([], findings)

    def test_unknown_state_is_invalid(self):
        errors, _ = mod.inspect_surface(surface(auth_mode="magic"), 0)
        self.assertTrue(errors)


if __name__ == "__main__":
    unittest.main()

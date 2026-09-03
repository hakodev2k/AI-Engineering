import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("listener_policy_check", ROOT / "scripts" / "listener_policy_check.py")
listener = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(listener)

POLICY = {
    "require_inbound_auth_for_non_loopback": True,
    "require_distinct_inbound_and_downstream_credentials": True,
    "require_host_validation_for_http": True,
    "require_origin_validation_when_browser_reachable": True,
    "require_dns_rebinding_protection_when_browser_reachable": True,
    "fail_startup_on_policy_violation": True,
}


def check(**overrides):
    args = dict(
        bind_host="127.0.0.1",
        transport="http",
        inbound_auth=False,
        downstream_credential=False,
        same_credential=False,
        browser_reachable=False,
        host_validation=False,
        origin_validation=False,
        dns_rebinding_protection=False,
        policy=POLICY,
    )
    args.update(overrides)
    return listener.evaluate(**args)


class ListenerPolicyTests(unittest.TestCase):
    def test_loopback_without_auth_allowed(self):
        self.assertTrue(check()["allowed"])

    def test_ipv6_loopback_without_auth_allowed(self):
        self.assertTrue(check(bind_host="::1")["allowed"])

    def test_all_interfaces_without_auth_denied(self):
        result = check(bind_host="0.0.0.0")
        self.assertFalse(result["allowed"])
        self.assertIn("non_loopback_requires_inbound_auth", result["reasons"])

    def test_lan_bind_without_auth_denied(self):
        self.assertFalse(check(bind_host="192.168.1.20")["allowed"])

    def test_exposed_http_requires_host_validation(self):
        result = check(bind_host="0.0.0.0", inbound_auth=True)
        self.assertFalse(result["allowed"])
        self.assertIn("host_validation_required", result["reasons"])

    def test_exposed_http_with_auth_and_host_validation_allowed(self):
        self.assertTrue(check(bind_host="0.0.0.0", inbound_auth=True, host_validation=True)["allowed"])

    def test_same_inbound_and_downstream_credential_denied(self):
        result = check(bind_host="0.0.0.0", inbound_auth=True, downstream_credential=True, same_credential=True, host_validation=True)
        self.assertFalse(result["allowed"])
        self.assertIn("inbound_downstream_credential_role_confusion", result["reasons"])

    def test_browser_reachable_requires_origin_and_rebinding_controls(self):
        result = check(bind_host="0.0.0.0", inbound_auth=True, host_validation=True, browser_reachable=True)
        self.assertFalse(result["allowed"])
        self.assertIn("origin_validation_required", result["reasons"])
        self.assertIn("dns_rebinding_protection_required", result["reasons"])

    def test_browser_reachable_complete_controls_allowed(self):
        result = check(
            bind_host="0.0.0.0",
            inbound_auth=True,
            host_validation=True,
            browser_reachable=True,
            origin_validation=True,
            dns_rebinding_protection=True,
        )
        self.assertTrue(result["allowed"])


if __name__ == "__main__":
    unittest.main()

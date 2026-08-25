import unittest
from scripts.verify_dispatch_policy import check


class DispatchParityTests(unittest.TestCase):
    def setUp(self):
        self.policy = {"resolver_fallback_enabled": False, "explicit_global_tools": [], "require_request_membership": True}

    def test_request_member_allowed(self):
        self.assertEqual(check({"request_tools": ["read"], "tool_name": "read"}, self.policy)[0], 0)

    def test_unadvertised_tool_blocked(self):
        self.assertEqual(check({"request_tools": ["read"], "tool_name": "write"}, self.policy), (2, "not_authorized_for_request"))

    def test_fallback_does_not_allow_arbitrary_tool(self):
        policy = {"resolver_fallback_enabled": True, "explicit_global_tools": ["status"]}
        self.assertEqual(check({"request_tools": ["read"], "tool_name": "write"}, policy)[0], 2)

    def test_explicit_exception_can_be_modeled(self):
        policy = {"resolver_fallback_enabled": True, "explicit_global_tools": ["status"]}
        self.assertEqual(check({"request_tools": ["read"], "tool_name": "status"}, policy), (0, "explicit_global_fallback"))

    def test_invalid_event_fails_closed(self):
        self.assertEqual(check({"tool_name": "read"}, self.policy)[0], 3)


if __name__ == "__main__":
    unittest.main()

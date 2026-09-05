import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "check_egress_policy.py"
spec = importlib.util.spec_from_file_location("egress_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def base_policy():
    return {
        "task_id": "t",
        "default_deny": True,
        "allow_wildcard_internet": False,
        "destinations": [{
            "hostname": "api.example.internal",
            "ports": [443],
            "protocols": ["tcp"],
            "resolved_cidrs": ["10.0.0.0/24"],
            "requires_human_approval_for_write": True,
            "purpose": "owned test API"
        }]
    }


class EgressGuardTests(unittest.TestCase):
    def test_valid_policy_passes(self):
        self.assertEqual([], mod.validate(base_policy()))

    def test_default_allow_blocks(self):
        p = base_policy(); p["default_deny"] = False
        self.assertTrue(any("default_deny" in x for x in mod.validate(p)))

    def test_wildcard_cidr_blocks(self):
        p = base_policy(); p["destinations"][0]["resolved_cidrs"] = ["0.0.0.0/0"]
        self.assertTrue(any("wildcard" in x for x in mod.validate(p)))

    def test_malformed_hostname_blocks(self):
        p = base_policy(); p["destinations"][0]["hostname"] = "evil.example\\x00.allowed.internal"
        self.assertTrue(any("hostname" in x for x in mod.validate(p)))

    def test_missing_purpose_blocks(self):
        p = base_policy(); p["destinations"][0]["purpose"] = ""
        self.assertTrue(any("purpose" in x for x in mod.validate(p)))


if __name__ == "__main__":
    unittest.main()

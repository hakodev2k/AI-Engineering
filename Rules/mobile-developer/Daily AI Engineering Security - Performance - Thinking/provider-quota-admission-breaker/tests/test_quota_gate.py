import importlib.util
import pathlib
import unittest
from datetime import datetime, timezone

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "quota_gate.py"
spec = importlib.util.spec_from_file_location("quota_gate", MODULE)
qg = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(qg)


class QuotaGateTests(unittest.TestCase):
    def test_closed_matching_resource_denied(self):
        state = {"resources": {"r1": {"status": "closed", "generation": 1}}}
        result = qg.decide(state, {"kind": "provider", "resource_key": "r1"})
        self.assertEqual("deny", result["decision"])

    def test_other_resource_allowed(self):
        state = {"resources": {"r1": {"status": "closed", "generation": 1}}}
        result = qg.decide(state, {"kind": "provider", "resource_key": "r2"})
        self.assertEqual("allow", result["decision"])

    def test_local_allowed(self):
        state = {"resources": {"r1": {"status": "closed", "generation": 1}}}
        self.assertEqual("allow", qg.decide(state, {"kind": "local"})["decision"])

    def test_unknown_scope_is_not_shared(self):
        state = {"resources": {"r1": {"status": "closed", "generation": 1}}}
        self.assertEqual("allow", qg.decide(state, {"kind": "provider"})["decision"])

    def test_probe_after_reset(self):
        state = {"resources": {"r1": {
            "status": "cooldown",
            "generation": 2,
            "reset_at": "2026-08-20T07:00:00Z",
            "probe_claimed": False,
        }}}
        now = datetime(2026, 8, 20, 8, 0, tzinfo=timezone.utc)
        self.assertEqual("probe", qg.decide(state, {"kind": "provider", "resource_key": "r1"}, now)["decision"])

    def test_second_probe_denied(self):
        state = {"resources": {"r1": {
            "status": "cooldown",
            "generation": 2,
            "reset_at": "2026-08-20T07:00:00Z",
            "probe_claimed": True,
        }}}
        now = datetime(2026, 8, 20, 8, 0, tzinfo=timezone.utc)
        self.assertEqual("deny", qg.decide(state, {"kind": "provider", "resource_key": "r1"}, now)["decision"])


if __name__ == "__main__":
    unittest.main()

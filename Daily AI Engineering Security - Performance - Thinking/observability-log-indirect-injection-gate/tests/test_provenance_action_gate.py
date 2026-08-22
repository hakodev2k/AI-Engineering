import importlib.util
import json
import pathlib
import tempfile
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "provenance_action_gate.py"
spec = importlib.util.spec_from_file_location("gate", SCRIPT)
gate = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(gate)

POLICY = {
    "untrusted_source_classes": ["log", "trace", "alert"],
    "high_impact_capabilities": ["shell_exec", "infra_mutation", "secret_read"],
    "allow_read_only_from_untrusted": True,
    "require_provenance": True,
    "approval_ttl_seconds": 900,
    "fail_closed_on_unknown_source": True,
}


def record(capabilities, *, source="log", derived=True):
    return {
        "source_class": source,
        "provenance": {"derived_from_source": derived, "evidence_ids": ["evt-1"]},
        "action": {
            "tool": "ops",
            "operation": "inspect" if not capabilities else "change",
            "resource": "service-a",
            "environment": "prod",
            "arguments": {"id": 7},
            "capabilities": capabilities,
        },
    }


class GateTests(unittest.TestCase):
    def test_read_only_untrusted_evidence_is_allowed(self):
        result, code = gate.evaluate(record([]), POLICY, 1000)
        self.assertEqual(code, gate.ALLOW)
        self.assertEqual(result["reason"], "read_only_investigation")

    def test_high_impact_requires_approval(self):
        result, code = gate.evaluate(record(["infra_mutation"]), POLICY, 1000)
        self.assertEqual(code, gate.APPROVAL_REQUIRED)
        self.assertEqual(result["decision"], "approval_required")

    def test_exact_fresh_approval_allows(self):
        r = record(["shell_exec"])
        h = gate.canonical_hash(r["action"])
        r["approval"] = {"granted": True, "approver": "operator", "issued_at_epoch": 900, "action_sha256": h}
        result, code = gate.evaluate(r, POLICY, 1000)
        self.assertEqual(code, gate.ALLOW)
        self.assertEqual(result["reason"], "fresh_exact_approval")

    def test_stale_approval_does_not_allow(self):
        r = record(["shell_exec"])
        r["approval"] = {"granted": True, "approver": "operator", "issued_at_epoch": 1, "action_sha256": gate.canonical_hash(r["action"])}
        _, code = gate.evaluate(r, POLICY, 1000)
        self.assertEqual(code, gate.APPROVAL_REQUIRED)

    def test_unknown_source_fails_closed(self):
        result, code = gate.evaluate(record([], source="mystery"), POLICY, 1000)
        self.assertEqual(code, gate.DENY)
        self.assertEqual(result["reason"], "unknown_source_class")

    def test_contract_is_scoped(self):
        r = record(["infra_mutation"])
        r["remediation_contract"] = {
            "enabled": True,
            "expires_at_epoch": 1200,
            "allowed_operations": ["change"],
            "allowed_resources": ["service-a"],
        }
        _, code = gate.evaluate(r, POLICY, 1000)
        self.assertEqual(code, gate.ALLOW)
        r["action"]["resource"] = "service-b"
        _, code = gate.evaluate(r, POLICY, 1000)
        self.assertEqual(code, gate.APPROVAL_REQUIRED)


if __name__ == "__main__":
    unittest.main()

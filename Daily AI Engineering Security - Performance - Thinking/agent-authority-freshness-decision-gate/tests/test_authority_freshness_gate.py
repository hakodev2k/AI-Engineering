import importlib.util
import pathlib
import unittest
from datetime import datetime, timezone

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "authority_freshness_gate.py"
spec = importlib.util.spec_from_file_location("authority_freshness_gate", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(mod)

NOW = datetime(2026, 8, 29, 19, 0, 0, tzinfo=timezone.utc)
REGISTRY = {
    "sources": {
        "desired-state": {"authority_rank": 100, "mutable": True, "max_age_seconds": 300, "required_for": ["configuration-change"]},
        "user-approval": {"authority_rank": 100, "mutable": True, "max_age_seconds": 3600, "required_for": ["scope-expansion"]},
        "persistent-memory": {"authority_rank": 20, "mutable": False, "max_age_seconds": 86400, "required_for": []},
    },
    "minimum_authority_rank": 80,
    "require_independent_verification_for_high_impact": True,
}


def base_decision():
    return {
        "action_type": "configuration-change",
        "impact": "high",
        "approval": {"present": True, "scopes": ["configuration-change"]},
        "facts": [{
            "id": "desired_model",
            "critical": True,
            "source": "desired-state",
            "observed_at": "2026-08-30T01:58:00+07:00",
            "authority_rank": 100,
            "source_version": "v7",
            "current_source_version": "v7",
            "evidence": "registry says model=x",
        }],
        "assumptions": [],
        "hypotheses": [],
        "decision": "apply desired model",
        "risks": ["provider unavailable"],
        "verification_status": "pending",
    }


class GateTests(unittest.TestCase):
    def test_fresh_authoritative_decision_allowed(self):
        r = mod.evaluate(base_decision(), REGISTRY, NOW)
        self.assertEqual(r["status"], "allow")
        self.assertTrue(r["verification_required"])

    def test_stale_fact_requires_revalidation(self):
        d = base_decision()
        d["facts"][0]["observed_at"] = "2026-08-30T01:00:00+07:00"
        self.assertEqual(mod.evaluate(d, REGISTRY, NOW)["status"], "revalidate")

    def test_memory_cannot_replace_authoritative_source(self):
        d = base_decision()
        d["facts"][0].update({"source": "persistent-memory", "authority_rank": 20})
        r = mod.evaluate(d, REGISTRY, NOW)
        self.assertEqual(r["status"], "revalidate")
        self.assertIn("source:desired-state", r["facts_to_refresh"])

    def test_version_mismatch_requires_refresh(self):
        d = base_decision()
        d["facts"][0]["current_source_version"] = "v8"
        self.assertEqual(mod.evaluate(d, REGISTRY, NOW)["status"], "revalidate")

    def test_self_asserted_approval_blocks(self):
        d = base_decision()
        d["action_type"] = "scope-expansion"
        d["facts"] = [{
            "id": "approval",
            "critical": True,
            "source": "user-approval",
            "observed_at": "2026-08-30T01:58:00+07:00",
            "authority_rank": 100,
            "source_version": "a1",
            "current_source_version": "a1",
            "evidence": "approval record",
        }]
        d["approval"] = {"present": True, "scopes": ["scope-expansion"]}
        d["self_asserted_approval"] = True
        self.assertEqual(mod.evaluate(d, REGISTRY, NOW)["status"], "block")

    def test_missing_structure_blocks(self):
        d = base_decision()
        del d["hypotheses"]
        self.assertEqual(mod.evaluate(d, REGISTRY, NOW)["status"], "block")


if __name__ == "__main__":
    unittest.main()

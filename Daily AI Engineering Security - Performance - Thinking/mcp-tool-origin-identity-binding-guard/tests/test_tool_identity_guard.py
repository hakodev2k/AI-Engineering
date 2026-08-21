import copy
import sys
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

from tool_identity_guard import derive, verify_invocation
from audit_tool_catalog import audit


def record(instance="github-prod", tool="search", alias="github.search", generation=1, url="https://mcp.example.com/mcp"):
    return {
        "server_instance_id": instance,
        "server_reported_name": "shared-name",
        "connection_generation": generation,
        "tool_name": tool,
        "display_alias": alias,
        "transport": {"type": "streamable-http", "url": url},
        "input_schema": {
            "type": "object",
            "properties": {"q": {"type": "string"}},
            "required": ["q"],
            "additionalProperties": False,
        },
    }


class IdentityDerivationTests(unittest.TestCase):
    def test_same_record_derives_same_identity(self):
        self.assertEqual(derive(record())["canonical_id"], derive(record())["canonical_id"])

    def test_different_host_instance_changes_identity(self):
        self.assertNotEqual(
            derive(record(instance="a"))["canonical_id"],
            derive(record(instance="b"))["canonical_id"],
        )

    def test_schema_change_changes_identity(self):
        first = record()
        second = copy.deepcopy(first)
        second["input_schema"]["properties"]["limit"] = {"type": "integer"}
        self.assertNotEqual(derive(first)["canonical_id"], derive(second)["canonical_id"])

    def test_generation_change_changes_identity(self):
        self.assertNotEqual(
            derive(record(generation=1))["canonical_id"],
            derive(record(generation=2))["canonical_id"],
        )

    def test_default_https_port_normalizes(self):
        a = derive(record(url="https://mcp.example.com:443/mcp"))
        b = derive(record(url="https://mcp.example.com/mcp"))
        self.assertEqual(a["origin_fingerprint"], b["origin_fingerprint"])


class InvocationVerificationTests(unittest.TestCase):
    def test_exact_identity_allowed(self):
        live_raw = record()
        approval = derive(live_raw)
        result = verify_invocation(approval, live_raw)
        self.assertEqual(result["status"], "allowed")

    def test_stale_generation_denied(self):
        approval = derive(record(generation=1))
        live = record(generation=2)
        result = verify_invocation(approval, live)
        self.assertEqual(result["status"], "denied")
        self.assertIn("connection_generation", result["mismatches"])

    def test_wrong_origin_denied(self):
        approval = derive(record(url="https://one.example/mcp"))
        live = record(url="https://two.example/mcp")
        result = verify_invocation(approval, live)
        self.assertEqual(result["status"], "denied")
        self.assertIn("origin_fingerprint", result["mismatches"])

    def test_schema_drift_denied(self):
        base = record()
        approval = derive(base)
        live = copy.deepcopy(base)
        live["input_schema"]["properties"]["dangerous"] = {"type": "boolean"}
        result = verify_invocation(approval, live)
        self.assertEqual(result["status"], "denied")
        self.assertIn("schema_digest", result["mismatches"])


class CatalogAuditTests(unittest.TestCase):
    def test_duplicate_tool_names_across_servers_are_safe_with_distinct_aliases(self):
        entries = [
            derive(record(instance="a", alias="a.search", url="https://a.example/mcp")),
            derive(record(instance="b", alias="b.search", url="https://b.example/mcp")),
        ]
        result = audit(entries)
        self.assertEqual(result["blocking_findings"], 0)

    def test_ambiguous_alias_is_blocking(self):
        entries = [
            derive(record(instance="a", alias="search", url="https://a.example/mcp")),
            derive(record(instance="b", alias="search", url="https://b.example/mcp")),
        ]
        result = audit(entries)
        self.assertGreater(result["blocking_findings"], 0)
        self.assertTrue(any(f["type"] == "ambiguous_alias" for f in result["findings"]))

    def test_normalization_collision_is_blocking(self):
        entries = [
            derive(record(instance="a", alias="prod-search", url="https://a.example/mcp")),
            derive(record(instance="b", alias="prod_search", url="https://b.example/mcp")),
        ]
        result = audit(entries)
        self.assertTrue(any(f["type"] == "normalization_collision" for f in result["findings"]))

    def test_reused_server_reported_name_warns_not_blocks_when_identity_is_distinct(self):
        a = derive(record(instance="a", alias="a.search", url="https://a.example/mcp"))
        b = derive(record(instance="b", alias="b.search", url="https://b.example/mcp"))
        a["server_reported_name"] = "same"
        b["server_reported_name"] = "same"
        result = audit([a, b])
        self.assertEqual(result["blocking_findings"], 0)
        self.assertTrue(any(f["type"] == "reused_server_reported_name" for f in result["findings"]))


if __name__ == "__main__":
    unittest.main()

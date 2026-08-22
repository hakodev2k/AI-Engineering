import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "taint_gate.py"
spec = importlib.util.spec_from_file_location("taint_gate", SCRIPT)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)

POLICY = {
    "trusted_sources": ["user-direct", "system-policy"],
    "untrusted_sources": ["repository-file", "repository-filename", "issue"],
    "high_impact_tools": ["shell", "test", "network-post"],
    "deny_when_untrusted": {
        "secret_access_and_network": True,
        "destructive_write_without_approval": True,
        "sandbox_bypass": True,
    },
    "require_approval_when_untrusted": {
        "executes_repository_code": True,
        "network_access": True,
        "writes_outside_workspace": True,
        "github_write": True,
        "package_install": True,
    },
}


def decision(source_type="repository-file", trust=None, tool="test", **caps):
    source = {"type": source_type}
    if trust is not None:
        source["trust"] = trust
    return {
        "sources": [source],
        "tool": {"name": tool, "capabilities": caps},
        "environment": {"has_secrets": False},
        "approval": {"granted": False},
    }


def test_untrusted_repository_test_requires_approval():
    result = module.decide(decision(executes_repository_code=True), POLICY)
    assert result["decision"] == "require_approval"


def test_action_bound_approval_allows_repository_test():
    data = decision(executes_repository_code=True)
    data["approval"] = {"granted": True, "action_id": "repo@abc:test"}
    result = module.decide(data, POLICY)
    assert result["decision"] == "allow"


def test_secret_bearing_environment_plus_network_is_denied():
    data = decision(tool="network-post", network_access=True)
    data["environment"] = {"has_secrets": True}
    result = module.decide(data, POLICY)
    assert result["decision"] == "deny"


def test_sandbox_bypass_is_denied():
    result = module.decide(decision(tool="shell", sandbox_bypass=True), POLICY)
    assert result["decision"] == "deny"


def test_unknown_provenance_high_impact_requires_approval():
    result = module.decide(decision(source_type="new-source", tool="shell"), POLICY)
    assert result["decision"] == "require_approval"


def test_trusted_read_only_action_is_allowed():
    result = module.decide(decision(source_type="user-direct", tool="read", trust="trusted"), POLICY)
    assert result["decision"] == "allow"

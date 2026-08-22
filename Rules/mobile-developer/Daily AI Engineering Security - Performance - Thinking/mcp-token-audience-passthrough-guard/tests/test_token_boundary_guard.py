import importlib.util
from pathlib import Path

MODULE = Path(__file__).parents[1] / "scripts" / "token_boundary_guard.py"
spec = importlib.util.spec_from_file_location("guard", MODULE)
guard = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(guard)

POLICY = {
    "mcp_resource": "https://mcp.example.com/",
    "trusted_issuers": ["https://auth.example.com/"],
    "required_scopes": ["tools.read"],
    "require_audience": True,
    "forbid_inbound_token_passthrough": True,
    "allow_outbound_hosts": ["api.example.com"],
}


def base():
    return {
        "issuer": "https://auth.example.com/",
        "audience": ["https://mcp.example.com/"],
        "scopes": ["tools.read"],
        "cryptographically_validated": True,
    }


def test_valid_ingress_allowed():
    assert guard.evaluate(base(), POLICY)["decision"] == "allow"


def test_wrong_audience_denied():
    d = base(); d["audience"] = ["https://other.example.com/"]
    assert guard.evaluate(d, POLICY)["decision"] == "deny"


def test_missing_scope_denied():
    d = base(); d["scopes"] = []
    assert guard.evaluate(d, POLICY)["decision"] == "deny"


def test_unvalidated_metadata_denied():
    d = base(); d["cryptographically_validated"] = False
    assert guard.evaluate(d, POLICY)["decision"] == "deny"


def test_passthrough_denied():
    d = base(); d.update({
        "outbound_host": "api.example.com",
        "inbound_token_fingerprint": "same",
        "outbound_credential_fingerprint": "same",
        "outbound_credential_source": "inbound-bearer",
    })
    assert guard.evaluate(d, POLICY)["decision"] == "deny"


def test_distinct_upstream_identity_allowed():
    d = base(); d.update({
        "outbound_host": "api.example.com",
        "inbound_token_fingerprint": "inbound",
        "outbound_credential_fingerprint": "upstream",
        "outbound_credential_source": "oauth-client-credentials",
    })
    assert guard.evaluate(d, POLICY)["decision"] == "allow"

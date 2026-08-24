import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "mcp_scope_guard.py"
spec = importlib.util.spec_from_file_location("mcp_scope_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)


def test_required_scope_survives_metadata_merge():
    result = mod.analyze({
        "required_scopes": ["offline_access", "files.read"],
        "supported_scopes": ["offline_access", "files.read", "files.write"],
        "require_refresh": True,
    })
    assert result["ok"]
    assert "offline_access" in result["effective_scopes"]


def test_required_scope_loss_blocks():
    result = mod.analyze({
        "required_scopes": ["offline_access"],
        "supported_scopes": ["files.read"],
        "require_refresh": True,
    })
    assert not result["ok"]
    assert any("required scope loss" in e for e in result["errors"])


def test_step_up_accumulates_granted_scope():
    result = mod.analyze({
        "granted_scopes": ["files.read"],
        "challenge_scopes": ["files.write"],
        "supported_scopes": ["files.read", "files.write"],
    })
    assert result["ok"]
    assert result["effective_scopes"] == ["files.read", "files.write"]


def test_provenance_is_explicit():
    result = mod.analyze({
        "required_scopes": ["files.read"],
        "challenge_scopes": ["files.write"],
    })
    assert result["provenance"]["files.read"] == ["required"]
    assert result["provenance"]["files.write"] == ["challenge"]

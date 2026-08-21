import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "tenant_boundary_gate.py"
spec = importlib.util.spec_from_file_location("tenant_boundary_gate", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def test_safe_read_passes():
    result = mod.evaluate({
        "tenant": "tenant-a",
        "tenant_source": "claim",
        "tenant_source_trusted": True,
        "operation": "customers:list",
        "kind": "read",
        "read_tenant_scoped": True,
        "write_tenant_match_verified": False,
        "cross_tenant": False,
        "exception_approved": False,
        "uses_query_filter_bypass": False,
        "tenant_from_request_body": False,
    })
    assert result["status"] == "pass"
    assert result["verification"]["tenant_context_resolved"] is True
    assert result["verification"]["read_scope_safe"] is True


def test_unscoped_read_blocks():
    result = mod.evaluate({
        "tenant": "tenant-a",
        "tenant_source": "claim",
        "tenant_source_trusted": True,
        "operation": "orders:list",
        "kind": "read",
        "read_tenant_scoped": False,
    })
    assert result["status"] == "block"
    assert any(x["code"] == "READ_UNSCOPED" for x in result["findings"])


def test_cross_tenant_write_without_approval_blocks():
    result = mod.evaluate({
        "tenant": "tenant-a",
        "tenant_source": "service-context",
        "tenant_source_trusted": True,
        "operation": "orders:update",
        "kind": "update",
        "write_tenant_match_verified": True,
        "cross_tenant": True,
        "exception_approved": False,
    })
    assert result["status"] == "block"
    assert any(x["code"] == "CROSS_TENANT_UNAPPROVED" for x in result["findings"])


def test_write_with_verified_ownership_passes():
    result = mod.evaluate({
        "tenant": "tenant-a",
        "tenant_source": "route",
        "tenant_source_trusted": True,
        "operation": "profile:update",
        "kind": "update",
        "write_tenant_match_verified": True,
        "cross_tenant": False,
    })
    assert result["status"] == "pass"
    assert result["verification"]["write_scope_safe"] is True

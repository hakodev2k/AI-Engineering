#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

SEVERITY_ORDER = {"info": 0, "warning": 1, "high": 2, "critical": 3}

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc

def finding(code, severity, message, evidence):
    return {"code": code, "severity": severity, "message": message, "evidence": evidence}

def evaluate(doc):
    fs = []
    tenant = doc.get("tenant")
    operation = str(doc.get("operation", "unknown"))
    source = doc.get("tenant_source")
    trusted = bool(doc.get("tenant_source_trusted", False))
    read_scoped = bool(doc.get("read_tenant_scoped", False))
    write_match = bool(doc.get("write_tenant_match_verified", False))
    cross = bool(doc.get("cross_tenant", False))
    approved = bool(doc.get("exception_approved", False))

    if not tenant:
        fs.append(finding("TENANT_MISSING", "critical", "Tenant context is missing.", ["tenant is empty"]))
    if not source or not trusted:
        fs.append(finding("TENANT_SOURCE_UNTRUSTED", "critical", "Tenant source is missing or untrusted.", [f"tenant_source={source!r}", f"trusted={trusted}"]))

    kind = str(doc.get("kind", "read")).lower()
    if kind in {"read", "query"} and not read_scoped:
        fs.append(finding("READ_UNSCOPED", "critical", "Tenant-scoped read lacks a proven tenant boundary.", ["read_tenant_scoped=false"]))
    if kind in {"write", "create", "update", "delete"} and not write_match:
        fs.append(finding("WRITE_OWNERSHIP_UNVERIFIED", "critical", "Write target tenant ownership is not verified.", ["write_tenant_match_verified=false"]))
    if cross and not approved:
        fs.append(finding("CROSS_TENANT_UNAPPROVED", "critical", "Cross-tenant operation lacks explicit approval.", ["cross_tenant=true", "exception_approved=false"]))
    if doc.get("uses_query_filter_bypass", False):
        fs.append(finding("FILTER_BYPASS", "high", "Query-filter bypass requires explicit evidence and approval.", ["uses_query_filter_bypass=true"]))
    if doc.get("tenant_from_request_body", False):
        fs.append(finding("CALLER_CONTROLLED_TENANT", "high", "Tenant authority is derived from caller-controlled payload.", ["tenant_from_request_body=true"]))

    blocking = any(SEVERITY_ORDER[x["severity"]] >= SEVERITY_ORDER["high"] for x in fs)
    status = "block" if blocking else "pass"
    return {
        "status": status,
        "tenant": tenant,
        "operation": operation,
        "findings": fs,
        "verification": {
            "tenant_context_resolved": bool(tenant and source and trusted),
            "read_scope_safe": read_scoped if kind in {"read", "query"} else True,
            "write_scope_safe": write_match if kind in {"write", "create", "update", "delete"} else True,
            "exception_approved": approved if cross else True
        }
    }

def main():
    p = argparse.ArgumentParser(description="Deterministic multi-tenant data-boundary gate")
    p.add_argument("manifest", help="Operation manifest JSON")
    p.add_argument("--output", help="Write result JSON")
    args = p.parse_args()
    try:
        result = evaluate(load_json(args.manifest))
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    print(text)
    return 1 if result["status"] == "block" else 0

if __name__ == "__main__":
    raise SystemExit(main())

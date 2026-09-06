# MCP Control-Plane Caller Authorization Guard

**Category:** Security

## Problem
Privileged MCP adapters can confuse two independent trust directions: authentication from the MCP server to its backend and authentication/authorization from the caller to the MCP server. If a reachable listener accepts unauthenticated callers while holding a powerful backend credential, those callers can inherit backend authority through normal MCP tool calls.

## Evidence
Current evidence is summarized in `evidence/research.md`. The central public case is CVE-2026-82456 / GHSA-rp45-5x3v-48mr in argocd-mcp 0.8.0, where a broadly bound HTTP transport could accept sessions without caller credentials and execute Argo CD operations using the server's stored token. The project fixed the issue in 0.9.0 and published stronger operator guidance around listener protection, network exposure, caller separation, and read-only mode.

## Existing approach
Patching, private binds, listener authentication, authenticated proxies, Origin/Host validation, read-only mode, separate instances, backend RBAC and network policies all reduce risk.

## Existing limitations
These controls are often reviewed independently. A deployment can have a valid backend token and network policy yet still lack a true caller-identity boundary. Shared listener secrets may not express different caller privileges, while read-only mode limits mutation without preventing unauthorized reads. Configuration intent can also diverge from the effective runtime bind/proxy path.

## Proposed improvement
Treat the MCP listener, inbound caller identity, tool authorization, backend credential scope and tool mutability as one authorization envelope. A deterministic preflight blocks unsafe combinations before deployment; an independent verifier confirms effective runtime state.

## Architecture
- `skills/audit-auth-boundary.md` — evidence-driven boundary audit procedure.
- `rules/authz-boundary-rules.md` — enforceable security invariants.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/audit-remediate-verify.md` — bounded remediation and verification flow.
- `hooks/preflight-auth-boundary.md` — blocking pre-deployment hook contract.
- `scripts/verify_mcp_auth_boundary.py` — dependency-free deterministic policy checker.
- `tests/test_verify_mcp_auth_boundary.py` — standard-library regression tests.
- `evidence/research.md` — current public evidence and root-cause analysis.

## Package tree
```text
mcp-control-plane-caller-authz-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── preflight-auth-boundary.md
├── rules/
│   └── authz-boundary-rules.md
├── scripts/
│   └── verify_mcp_auth_boundary.py
├── skills/
│   └── audit-auth-boundary.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_verify_mcp_auth_boundary.py
└── workflows/
    └── audit-remediate-verify.md
```

## Installation
Requires Python 3.10+ and no third-party dependencies. Copy the package directory into the engineering-control repository or CI policy workspace.

## Configuration
Create a sanitized JSON record with:
- `bind_address`: effective listener address.
- `external_reachable`: boolean based on actual network path.
- `inbound_auth_mode`: `none`, `shared-secret`, `per-caller`, `authenticated-proxy`, or `mtls`.
- `caller_identities`: declared identities available to authorization policy.
- `read_only`: effective read-only mode.
- `backend_credential`: `{ "present": bool, "scope": [...] }`; never include the secret value.
- `tools`: objects with `name`, `class`, `authorized_callers`, and `required_backend_scope`.

Privileged classes recognized by the checker are `write`, `destructive`, `administrative`, `secret-read`, and `egress`.

## Usage
Run the deterministic gate:

```bash
python3 scripts/verify_mcp_auth_boundary.py deployment.json
```

Run regression tests:

```bash
python3 -m unittest tests/test_verify_mcp_auth_boundary.py
```

Exit codes are 0 for pass, 1 for malformed input/runtime error, and 2 for blocking security findings.

## Workflow
Follow `workflows/audit-remediate-verify.md`: Observe → measure baseline → diagnose failed authorization invariant → choose minimal safe remediation → implement → measure again → independently verify. Maximum three remediation iterations are allowed.

## Metrics
- Unauthenticated reachable privileged listeners: **0**.
- Privileged tools without explicit caller authorization: **0**.
- Broad externally reachable binds without inbound authentication: **0**.
- Unused backend privilege entries: **0** unless an approved exception is documented outside the package.
- Independent runtime verification coverage: **100%** for privileged deployments.

## Verification
**Implemented** means package controls are integrated. **Measured** means the deterministic checker evaluated the effective deployment description. **Verified** additionally requires an independent reviewer to confirm runtime listener/proxy exposure, enabled tool surface, caller-identity boundary and backend scope. A configuration-only pass is not sufficient.

## Safety
Do not store raw credentials in checker inputs. Do not perform production mutations to prove authorization unless a human explicitly approves the test and rollback plan. Do not weaken authentication, network controls, backend RBAC or verification thresholds to make the checker pass.

## Failure handling
Detection is a nonzero checker exit or independent review failure. Preserve sanitized evidence. Retry only after an evidence-backed configuration change, at most three times. If unresolved, bind to a safer boundary and/or disable mutating tools, escalate to platform/security ownership, and keep completion blocked.

## Definition of Done
- Current evidence documented.
- Effective baseline captured.
- Inbound caller identity separated from backend credential identity.
- Explicit authorization exists for every privileged tool.
- Backend credential is least privilege for the enabled tool surface.
- Deterministic checker passes.
- Regression tests pass in the target environment.
- Effective runtime exposure is independently verified.
- No secrets appear in evidence or inputs.
- No blocking risk remains.

## Customization
Extend `PRIVILEGED_CLASSES` or deployment metadata only when the organization has a stable, testable policy need. Keep fail-closed semantics for unknown exposure and privileged tool use. For environments with multiple caller classes, prefer distinct caller identities and explicit tool authorization over a single shared listener secret.

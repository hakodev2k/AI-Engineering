# MCP OAuth Resource Audience Binding Guard

**Category:** Security  
**Run date:** 2026-09-06 (UTC+7)

## Problem
MCP authorization deployments can accept or forward access tokens that are not cryptographically/resource-bound to the intended MCP server. This creates confused-deputy, token-passthrough and cross-service replay risk even when OAuth is otherwise configured correctly.

## Evidence
Current MCP authorization guidance requires clients to send RFC 8707 `resource` and servers to accept only tokens intended for themselves. A 2026 MCP Registry advisory (CVE-2026-44428 / GHSA-95c3-6vvw-4mrq) demonstrated cross-registry OIDC token replay caused by a shared audience. See `evidence/research.md`.

## Existing approach
OAuth 2.1, Protected Resource Metadata, RFC 8707 resource indicators, audience validation, separate upstream tokens, issuer verification and server-side token validation are the correct primitives.

## Remaining limitation
Teams frequently validate issuer/signature/scopes without proving that the token is bound to the exact resource being called. Gateways can also pass an inbound token to an upstream API, collapsing two trust boundaries into one credential.

## Proposed improvement
This package adds a deterministic authorization preflight that validates policy fixtures for resource/audience binding, issuer expectations, passthrough prohibition and least-privilege scopes before an MCP integration is considered verified.

## Package tree
```
README.md
evidence/research.md
skills/mcp-authorization-audit.md
rules/oauth-resource-boundary.md
subagents/authorization-reviewer.md
workflows/audit-remediate-verify.md
hooks/preflight-authorization.md
scripts/mcp_oauth_guard.py
tests/test_mcp_oauth_guard.py
```

## Installation
Requires Python 3.10+ and only the standard library.

## Configuration
Prepare a JSON policy document containing `resource`, `expected_resource`, `audience`, `expected_audience`, `issuer`, `expected_issuer`, `scopes`, `allowed_scopes`, and `token_passthrough`.

## Usage
```bash
python scripts/mcp_oauth_guard.py policy.json
python -m unittest tests/test_mcp_oauth_guard.py
```

## Workflow
Follow `workflows/audit-remediate-verify.md`: observe authorization topology, collect evidence, establish the expected trust boundaries, run the deterministic guard, remediate mismatches, then independently verify.

## Metrics
- 100% protected MCP resources declare an expected resource identifier.
- 100% accepted tokens are audience/resource-bound to the server.
- 0 inbound MCP access tokens are forwarded unchanged to upstream APIs.
- 0 scopes exceed the configured allowlist.
- All negative fixtures fail closed.

## Verification
**Implemented:** policy guard, rules, workflow, review role and tests are present.  
**Measured:** the script reports per-policy violations and a deterministic exit code.  
**Verified:** completion requires the unit suite plus representative production-like policy fixtures to pass.

## Safety
The guard never requests credentials or token values. Feed metadata/claims or sanitized decoded token metadata only. Secret-bearing tokens MUST NOT be committed or logged.

## Failure handling
A missing expected resource/audience, issuer mismatch, passthrough flag, or excessive scope blocks completion. Retry remediation at most twice; then escalate to the identity/security owner with the failing evidence.

## Definition of Done
Evidence is recorded; expected trust boundaries are explicit; the guard passes; negative tests prove replay/passthrough cases are rejected; upstream credentials remain separate; no secret appears in output; an independent reviewer signs off.

## Customization
Extend the JSON contract with tenant, authorization-server or gateway fields only when they can be validated deterministically. Never weaken resource or audience checks to improve compatibility.
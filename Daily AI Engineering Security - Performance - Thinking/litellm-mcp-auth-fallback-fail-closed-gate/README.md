# LiteLLM MCP Auth Fallback Fail-Closed Gate

**Category:** Security  
**Run date:** 2026-09-05 (UTC+7)

## Problem
LiteLLM versions before 1.84.0 contained an MCP Streamable HTTP authentication flaw where failed LiteLLM key validation could fall through to OAuth2 passthrough and create an anonymous `UserAPIKeyAuth()` identity. A fabricated bearer token could therefore establish an MCP session and, for permissive MCP server policies such as `allow_all_keys`, reach configured tools. The same fixing change also tightened a public-route check that previously matched `.well-known` against an overly broad URL representation.

## Evidence
See `evidence/research.md`. This package separates observed public evidence, engineering interpretation, and the proposed control.

## Existing approach
Upgrade to LiteLLM 1.84.0+, disable/block MCP routes when upgrade is impossible, validate reverse-proxy routing, and configure MCP object permissions conservatively.

## Remaining limitation
Version upgrade is necessary but not sufficient for platform builders operating heterogeneous gateways. Authentication fallback behavior, public-route exceptions, and downstream tool authorization remain separate policy layers. Regression tests often prove valid authentication but omit malformed-token and public-route negative cases.

## Proposed improvement
A fail-closed deployment gate models MCP routes, authentication modes, fallback conditions, and tool authorization. It blocks vulnerable LiteLLM versions, broad unauthenticated public-route patterns, OAuth passthrough without explicitly OAuth2-targeted servers, and permissive tool exposure without a validated identity.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `skills/auth-boundary-assessment.md` — reusable assessment procedure.
- `rules/fail-closed-auth.md` — enforceable controls.
- `subagents/security-verifier.md` — independent verifier.
- `workflows/diagnose.md` — evidence-first diagnosis.
- `workflows/remediate-verify.md` — bounded remediation and verification.
- `hooks/predeploy.md` — blocking predeployment hook.
- `scripts/check_litellm_mcp_auth.py` — deterministic checker.
- `config/gateway.example.json` — safe example configuration.
- `tests/test_check_litellm_mcp_auth.py` — regression tests.

## Installation
Python 3.10+, standard library only.

## Configuration
Describe the effective LiteLLM version and MCP routes in `config/gateway.example.json` format. Values MUST reflect the deployed request path, including reverse proxies and route exposure.

## Usage
`python scripts/check_litellm_mcp_auth.py config/gateway.example.json`

Exit 0 = PASS; exit 2 = blocking security findings; exit 1 = invalid input/runtime error.

## Workflow
Observe advisory and deployed state -> establish baseline -> diagnose auth/fallback path -> patch/configure -> run deterministic gate -> execute negative authentication tests -> independent verification.

## Metrics
Vulnerable gateway instances; unauthenticated MCP routes; malformed-token acceptance rate; anonymous identities with tool access; public-route bypass cases; negative-auth test coverage.

## Verification
**Implemented:** checker, tests, rules, workflows and review role exist.  
**Measured:** deployment model and negative tests produce explicit pass/fail evidence.  
**Verified:** fixed version or equivalent compensating block is present; malformed bearer tokens fail; public discovery exceptions are path-scoped; anonymous callers cannot reach sensitive tools.

## Safety
Never test destructive MCP tools in production. Never store real tokens in configuration or fixtures. Do not weaken object permissions to make compatibility tests pass. Dangerous actions require explicit human approval.

## Failure handling
A blocking finding prevents deployment. Remediation may be retried twice. If the effective authentication path remains ambiguous or a negative-auth test succeeds, stop and escalate to the security owner.

## Definition of Done
Evidence documented; affected-version status known; route/auth model complete; deterministic gate passes; negative tests pass; tool permissions remain least-privilege; independent review passes; no secrets are stored.

## Customization
Add organization-specific route patterns or authorization invariants while retaining fail-closed semantics.
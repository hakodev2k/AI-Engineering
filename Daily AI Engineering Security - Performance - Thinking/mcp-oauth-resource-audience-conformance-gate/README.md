# MCP OAuth Resource Audience Conformance Gate

## Topic
MCP OAuth Resource Audience Conformance Gate

## Category
Security

## Problem
MCP OAuth integrations can obtain or accept tokens that are not bound to the intended MCP resource. Missing RFC 8707 `resource` parameters, wrong `aud` values, incomplete server validation, or inbound-token passthrough can break authorization boundaries and create confused-deputy risk.

## Evidence
`evidence/research.md` documents current signals: the MCP 2026-07-28 authorization/security requirements, Supabase Auth #2610, Codex #13891, and Microsoft MCP authentication guidance.

## Existing approach
Teams often rely on provider defaults, validate signature/expiry without strict audience checks, configure audiences manually, or reuse inbound bearer tokens for downstream APIs.

## Existing limitations
OAuth providers differ in RFC 8707 support; clients may omit `resource`; valid signatures do not prove intended audience; server-side audience configuration can drift; token passthrough may remain invisible without request tracing.

## Proposed improvement
Run an end-to-end deterministic conformance gate before protected MCP enablement. Validate resource parameters at authorization and token requests, issuer, intended audience, required privilege, expiration, negative fixtures, and downstream-token separation.

## Architecture
- `evidence/research.md` — current evidence and root causes.
- `skills/mcp-oauth-conformance-review.md` — reusable review procedure.
- `rules/oauth-resource-boundary.md` — enforceable security controls.
- `subagents/oauth-boundary-reviewer.md` — independent verifier.
- `workflows/conformance-and-regression.md` — bounded implementation/regression flow.
- `hooks/pre-enable-auth-gate.md` — blocking pre-enable integration point.
- `scripts/oauth_conformance_gate.py` — deterministic sanitized-evidence validator.

## Installation
Requires Python 3.9+ standard library. No OAuth library is required because the script validates sanitized observed evidence rather than minting or decoding production tokens.

## Configuration
Prepare a JSON object containing canonical resource URI, observed authorization/token resource values, expected/token issuer, expected/token audiences, required/token privileges, expiration status, and optional SHA-256 token fingerprints. Never provide raw credentials or bearer tokens.

## Usage
```bash
python3 scripts/oauth_conformance_gate.py conformance-input.json
```

Exit codes: `0` allow, `3` block, `2` invalid evidence.

## Workflow
Follow `workflows/conformance-and-regression.md`: baseline the existing flow, diagnose each failed boundary, implement minimal conformant change, rerun identical checks, execute negative fixtures, and hand off to an independent reviewer.

## Metrics
Conformance controls passed/total, wrong-audience accepts (target 0), wrong-issuer accepts (target 0), passthrough detections (target 0), negative-test coverage, verified client/provider/server combinations.

## Verification
A result is Verified only when `resource` is correct at both request stages, intended issuer/audience/privilege checks pass, wrong-audience/wrong-issuer/expired/insufficient-privilege fixtures are rejected, downstream passthrough is absent, and the independent reviewer signs off.

## Safety
Use test credentials. Do not store access tokens, refresh tokens, authorization codes, client secrets, or PKCE verifiers. Never solve interoperability by disabling audience validation. High-risk overrides require explicit authorized human approval.

## Failure handling
Detection: any failed control or invalid evidence. Retry: maximum 2 remediation cycles, each tied to a specific failed control. Fallback: keep connector disabled and redesign provider/client or downstream credential flow. Escalation: integration/security owner or provider/client maintainer. Stop: unresolved resource binding, audience validation, passthrough, or secret-safe evidence problem.

## Definition of Done
- **Implemented:** resource/audience controls configured and deterministic gate wired to pre-enable checks.
- **Measured:** baseline and post-change conformance results captured.
- **Verified:** all negative fixtures reject as expected, no token passthrough, independent review passed.

## Customization
Adapt claim names/privilege mapping to the provider while keeping canonical resource binding, audience validation, token separation, and secret-safe evidence requirements intact.
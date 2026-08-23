# MCP OAuth Resource Audience Compatibility Guard

## Topic
Protect MCP OAuth deployments from wrong-audience token acceptance and silent RFC 8707 compatibility downgrades.

## Category
Security

## Problem
MCP 2026-07-28 requires OAuth Resource Indicators and token audience validation, but some real providers do not support the required `resource` parameter at the token endpoint. Implementations can either break compatibility or accidentally weaken audience isolation.

## Evidence
See `evidence/research.md`. Current MCP specification text requires `resource` and audience validation; Microsoft documents an active compatibility limitation with providers such as Entra ID.

## Existing approach
Strict RFC 8707 resource binding, JWT audience checks, token introspection, scopes, and provider-specific workarounds.

## Existing limitations
Provider support differs; successful token issuance does not prove intended audience; opaque tokens complicate validation; scope-only fallbacks are weaker and easy to normalize into permanent bypasses.

## Proposed improvement
A fail-closed compatibility gate that independently proves token audience, records provider support, permits only explicit low-risk fallback, and blocks high-impact tools when audience binding cannot be demonstrated.

## Architecture
- `evidence/research.md` — public evidence, interpretation, root causes.
- `config/policy.json` — canonical resource, allowed audience, fallback policy.
- `rules/oauth-audience-boundary.md` — enforceable security invariants.
- `skills/verify-oauth-resource-boundary.md` — evidence-driven verification procedure.
- `subagents/oauth-security-reviewer.md` — independent review role.
- `workflows/research-verify-release.md` — bounded implementation and release workflow.
- `hooks/pre-tool-audience-check.md` — deterministic pre-tool enforcement contract.
- `scripts/audience_guard.py` — dependency-free decision script.
- `tests/test_audience_guard.py` — positive and negative regression fixtures.

## Installation
Python 3.10+ is sufficient for the script. `pytest` is required only for tests.

## Configuration
Replace the example `canonical_resource` and audiences in `config/policy.json`. Keep compatibility fallback disabled unless a security owner explicitly approves a low-impact exception.

## Usage
Prepare sanitized evidence, never a raw token:

```json
{"impact":"write","verified_audiences":["https://mcp.example.com/"],"resource_parameter_supported":true,"resource_parameter_sent":true,"token_kind":"jwt"}
```

Run:

```bash
python3 scripts/audience_guard.py audience-evidence.json --policy config/policy.json
```

Exit codes: `0` allow, `3` approved degraded low-risk fallback, `4` deny, `2` invalid evidence/config.

Run tests:

```bash
python -m pytest tests/test_audience_guard.py
```

## Workflow
Observe provider behavior → capture baseline → classify resource support → verify audience → implement configuration → rerun good/wrong-audience tests → independent review → release or deny. Maximum two configuration retries.

## Metrics
Wrong-audience rejection rate, number of silent downgrades, number of low-risk fallbacks, number of high-impact tools reachable without audience proof.

## Verification
A known-good token must be accepted and a token valid for another resource must be rejected. Opaque tokens require trusted introspection when configured. No raw token may appear in test artifacts.

## Safety
Never disable issuer/signature/expiry checks, never forward inbound MCP tokens to upstream APIs, never broaden scope to compensate for missing audience validation, and never allow high-impact operations under an unverifiable fallback.

## Failure handling
Detection: guard exit `2`/`4`, wrong-audience acceptance, ambiguous provider behavior, or missing evidence. Evidence: sanitized claims/introspection output and provider metadata. Retry: maximum 2 configuration attempts. Fallback: only configured low-impact mode with verified audience. Escalation: identity/security owner. Stop: wrong-audience acceptance, missing audience proof for high-impact tools, secret exposure, or exhausted retries.

## Definition of Done
**Implemented:** policy and pre-tool guard integrated. **Measured:** positive and negative fixtures executed. **Verified:** wrong-audience rejection is 100%, high-impact fallback is zero, independent reviewer approves, no secrets are stored, and all tests pass.

## Customization
Extend impact classes and evidence adapters for your provider, but preserve the invariant that compatibility cannot silently override audience isolation.

# MCP Token Audience & Passthrough Guard

**Category:** Security  
**Run date:** 2026-08-21 (Vietnam, UTC+7)

## Problem
A valid OAuth token is not necessarily valid for this MCP resource. Accepting a token for another audience, or forwarding the inbound bearer token to an upstream API, breaks resource isolation and can create confused-deputy and auditing failures.

## Evidence
See `evidence/research.md`. The MCP 2026-07-28 authorization and security guidance requires resource/audience binding and forbids token passthrough. RFC 8707 defines resource indicators used to bind token requests.

## Existing approach and limitation
Many integrations validate signature/issuer/expiry and scopes but omit resource identity, or let a gateway perform generic validation. Some proxy-style servers reuse the inbound bearer upstream. These approaches do not mechanically prove that the credential belongs to the current protected resource or that upstream trust uses a separate identity.

## Proposed improvement
Add a deterministic policy gate after cryptographic validation and before action dispatch. The gate checks the canonical MCP audience/resource, issuer, scopes, outbound host, and credential fingerprints. Protected egress must prove a distinct upstream credential source.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, gap, root causes, metrics.
- `config/policy.json` — resource, issuer, scope, egress-host and passthrough policy.
- `skills/token-boundary-audit.md` — reusable evidence-driven audit procedure.
- `rules/oauth-boundaries.md` — enforceable security rules.
- `subagents/security-verifier.md` — independent verifier; does not implement fixes.
- `workflows/audit-enforce-verify.md` — bounded baseline/change/retest workflow.
- `hooks/pre-request-boundary-check.md` — deterministic blocking hook contract.
- `scripts/token_boundary_guard.py` — executable sanitized-metadata policy checker.
- `tests/test_token_boundary_guard.py` — valid, wrong-audience, scope and passthrough fixtures.

## Installation
Python 3.10+ is sufficient for the guard. `pytest` is required only for tests:

```bash
python -m pip install pytest
```

Production token signature validation must use the OAuth/JWT library already appropriate for your stack; this package intentionally does not implement cryptography.

## Configuration
Copy `config/policy.json` and replace the example MCP resource, issuers, required scopes, and outbound hosts. Never put secrets or raw tokens in the policy.

## Usage
The input to the guard must contain sanitized metadata produced after trusted cryptographic validation.

```bash
python scripts/token_boundary_guard.py request.json --policy config/policy.json --strict
```

Exit codes: `0` allowed, `2` invalid evidence/configuration, `3` policy denied.

Run regression tests:

```bash
pytest -q tests/test_token_boundary_guard.py
```

## Workflow
Observe ingress and egress boundaries → establish negative/positive fixture baseline → diagnose missing resource separation → implement with standard auth libraries → rerun all fixtures → independent verification. Retry is bounded to three evidence-driven implementation cycles.

## Metrics
- Audience/resource validation coverage: target 100% of protected routes.
- Wrong/missing-audience rejection: target 100%.
- Inbound-token passthrough rejection: target 100%.
- Raw-token exposure in logs/context: target 0.
- Valid fixture regression: target 0%.

## Verification
### Implemented
Policy, rules, deterministic guard, fixtures, hook, audit skill, independent verifier and bounded workflow are present.

### Measured
Adopters measure fixture decisions and protected-route coverage using the test suite and their integration tests.

### Verified
Completion requires the independent verifier to confirm the actual production integration uses the canonical resource URI and a distinct upstream credential source; presence of these files alone is not proof of deployment correctness.

## Safety
The guard accepts only sanitized token metadata. Raw bearer/refresh tokens MUST NOT be passed to scripts, agents or logs. A guard pass does not authorize dangerous business actions; normal least-privilege and human-approval controls still apply.

## Failure handling
Detection: non-zero guard/test result. Evidence: structured deny reasons and failing fixture. Retry: max 3 changed hypotheses. Fallback: preserve fail-closed behavior. Escalation: human security owner. Stop on unknown resource identity, absent cryptographic validation, secret exposure, or repeated failure.

## Definition of Done
Evidence documented; canonical resource known; baseline fixtures captured; production implementation validates audience/resource; upstream credential is distinct; all positive/negative tests pass; no secret exposure is found; independent verifier returns `verified`; residual risks are documented.

## Customization
Extend policy only with observable fields. For opaque tokens, use trusted introspection to produce sanitized audience/resource and scope metadata. For multi-resource MCP deployments, run one policy instance per canonical protected resource rather than weakening audience checks.
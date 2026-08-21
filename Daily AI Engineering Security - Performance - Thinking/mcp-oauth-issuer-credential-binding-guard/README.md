# MCP OAuth Issuer Credential Binding Guard

## Category
Security

## Problem
Multi-server MCP clients can mishandle OAuth credentials when issuer/resource provenance is not explicitly bound across discovery, callback, token storage, refresh, and protected tool execution. MCP 2026-07-28 hardened this area with RFC 9207 issuer validation and issuer-bound client credentials.

## Evidence
See `evidence/research.md` for current public signals, official protocol guidance, limitations, and source links.

## Existing approach
Common implementations rely on generic OAuth state/PKCE, server-URL keyed credential storage, and SDK defaults. Those controls remain necessary but do not by themselves prove that a credential belongs to the current issuer/resource relationship.

## Existing limitations
Legacy stores may lack issuer provenance; resource metadata can migrate; an SDK upgrade may require explicit auth opt-ins; and token verification can be incomplete when it checks only signature and expiry.

## Proposed improvement
Persist `(protected resource, issuer, client identity)` provenance at authorization start, compare it before redemption, invalidate on issuer changes, enforce issuer plus audience/resource during protected calls, and fail closed using a deterministic gate.

## Architecture
- `evidence/research.md` — research and root-cause evidence.
- `config/policy.json` — deterministic policy values.
- `skills/authorization-boundary-audit.md` — reusable audit procedure.
- `rules/oauth-binding-rules.md` — enforceable security rules.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/audit-and-harden.md` — bounded implementation and verification flow.
- `hooks/pre-token-redemption.md` — blocking integration point.
- `scripts/validate_oauth_binding.py` — executable redacted evidence validator.

## Installation
Requires Python 3.9+ and only the standard library. Copy this package into the engineering harness or call the validator from an OAuth callback/redemption pipeline.

## Configuration
Edit `config/policy.json` only through normal code review. Keep issuer/resource checks enabled. Do not store real tokens, codes, PKCE verifiers, or client secrets in package configuration.

## Usage
Create a redacted binding envelope containing:
- `expected_issuer`
- `observed_issuer`
- `expected_resource`
- `observed_resource`
- `credential_has_provenance`
- `issuer_changed`
- optional `callback_started_at_epoch`

Run:

```bash
python scripts/validate_oauth_binding.py binding-envelope.json --policy config/policy.json
```

Exit codes: `0` allow, `2` invalid input, `4` reauthorize, `5` deny.

## Workflow
Use `workflows/audit-and-harden.md`: Observe → baseline → diagnose → hypothesize → implement → measure again → independent verification. Maximum two implementation/test cycles.

## Metrics
Issuer/resource binding coverage, negative mix-up fixtures blocked, legacy credentials requiring reauthorization, protected calls with complete verification, and secret-leak count.

## Verification
The implementation owner records measured behavior; `subagents/security-verifier.md` independently reruns positive and negative fixtures. `Implemented`, `Measured`, and `Verified` are separate states.

## Safety
Fail closed on issuer/resource ambiguity. Never pass token material to the validator or model context. Never weaken PKCE/state/issuer/audience checks to recover availability. Production IdP or client-registration changes require human approval.

## Failure handling
Detection: validator/test failure or metadata mismatch. Evidence: redacted envelope and exit decision. Retry: maximum two remediation cycles. Fallback: block protected execution and require reauthorization when allowed. Escalation: identity/security owner. Stop: unresolved issuer relationship, repeated verification failure, or secret exposure.

## Definition of Done
- Current evidence documented.
- Baseline captured.
- Root cause identified.
- Binding implementation completed.
- Positive fixture passes.
- Wrong issuer/resource, stale credential, replay-age, migration, and missing-provenance cases fail safely.
- No secrets exposed.
- Independent verifier passes all MUST rules.
- No blocking issue remains.

## Customization
Extend policy with organization-specific issuer allowlists or audience formats, but preserve exact provenance checks and fail-closed behavior. Add provider-specific token-claim adapters outside the validator rather than embedding secrets or network calls in it.
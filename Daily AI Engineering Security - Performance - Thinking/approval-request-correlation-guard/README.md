# Approval Request Correlation Guard

## Topic
Bind human/external approval responses to the exact live agent request.

## Category
Security

## Problem
Concurrent sessions, reconnects, stale UIs, interrupts, and remote approval clients can make approval lifecycle state ambiguous. Human approval is only a security boundary if the response cannot authorize a different or stale request.

## Evidence
See `evidence/research.md`. Current public signals include Codex #30714, #36392, and #21982.

## Existing approach
Approval prompts, request IDs, pending-request replay, session grants, and timeouts.

## Existing limitations
Identity can be spread across layers; UI state can stale; cancellation may not revoke every outstanding handle; semantic action/policy identity is often implicit.

## Proposed improvement
Use an immutable correlation envelope and a fail-closed verifier before every approval response is accepted.

## Architecture
- `evidence/research.md` — observed evidence, interpretation, root causes, metrics.
- `rules/correlation-boundary.md` — enforceable authorization invariants.
- `skills/approval-correlation-audit.md` — reusable audit procedure.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/verify-approval-lifecycle.md` — bounded implementation/verification flow.
- `hooks/pre-approval-response.md` — deterministic blocking hook.
- `scripts/verify_approval_envelope.py` — executable envelope verifier.
- `tests/test_envelope_cases.py` — exact-match and negative boundary tests.

## Installation
Requires Python 3.9+. No third-party packages.

## Envelope contract
Both live request and response JSON must include:
`session_id`, `turn_id`, `request_id`, `tool_call_id`, `action_digest`, `policy_digest`, `created_at`, `expires_at`, and `nonce`.
The live request may additionally contain `state` and `consumed`.

Digest the normalized action and effective approval policy using a stable canonical representation. Do not hash display text that can omit material arguments.

## Usage
`python3 scripts/verify_approval_envelope.py --request live.json --response response.json`

Exit 0 means exact live match. Any other exit blocks execution.

Run tests:
`python3 -m unittest tests/test_envelope_cases.py`

## Workflow
Observe lifecycle → capture baseline → enumerate identity dimensions → implement binding → test cross-session/stale/cancel/duplicate cases → independently verify.

## Metrics
Target zero false accepts, zero duplicate executions, zero pending approvals surviving terminal cancellation, and zero live requests missing required identity fields.

## Verification
A package is **Implemented** when artifacts exist and the hook can call the verifier. It is **Measured** when lifecycle telemetry is collected in an adopting system. It is **Verified** only when adversarial integration tests demonstrate zero mismatched authorization and the independent verifier signs off.

## Safety
Fail closed. Never map timeout, parse failure, unknown state, or missing fields to allow. Never log secrets. Human approval remains required wherever the underlying policy requires it.

## Failure handling
Detection: verifier non-zero exit, orphaned pending request, duplicate terminal response, or mismatched digest/identity.
Evidence: sanitized correlation fields and state transitions.
Retry: maximum 3 remediation/test cycles; each needs a changed hypothesis or implementation.
Fallback: disable external/automatic response acceptance and use exact local approval when safe and supported.
Escalation: security/control-plane owner.
Stop: any false accept blocks completion.

## Definition of Done
Evidence documented; exact binding fields defined; action/policy digests stable; cancellation revokes pending requests; deterministic tests pass; integration tests cover cross-session/reconnect; no secrets exposed; independent verification passes.

## Customization
Extend the envelope with workspace/tenant/host identity where those are authorization boundaries. Keep new fields immutable across presentation and response.

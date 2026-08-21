# Skill — Approval Correlation Audit

## Purpose
Audit an agent approval path for cross-session, stale-request, reconnect, and duplicate-response authorization defects.

## Trigger
Before shipping an approval integration; after any approval deadlock/misrouting incident; after changes to session resume, remote clients, or approval caching.

## Inputs
Request/response schemas, lifecycle transitions, logs, cancellation behavior, session identifiers, policy model, and representative approval traces.

## Preconditions
Use sanitized traces. Have read-only access to relevant logs. Do not execute dangerous actions during audit.

## Allowed tools
Schema inspection, log parsing, local test harnesses, hash utilities, unit/integration tests.

## Constraints
Do not infer identity from display text. Do not weaken approval requirements to make tests pass.

## Procedure
1. Enumerate identity dimensions: session, turn, request, tool call, action, policy, epoch/nonce.
2. Capture a normal successful baseline and record every field available at creation and response time.
3. Construct adversarial cases: response from another session, old turn, modified command, changed policy, expired request, cancelled turn, duplicated response, reconnect with stale UI.
4. Run `scripts/verify_approval_envelope.py` against each pair.
5. Confirm every mismatch fails closed and every valid exact match succeeds once.
6. Verify Stop/cancel revokes outstanding requests.
7. Verify reconnect rehydrates only currently live request IDs.
8. Record missing dimensions and classify their exploitability/operational risk.

## Decision points
- Missing required field: block rollout or require explicit human review.
- Semantic action changed but digest unchanged: digest construction is defective; stop.
- Any cross-session acceptance: severity critical for the integration; stop.

## Expected output
Audit table with test case, expected status, observed status, evidence, and remediation.

## Metrics
Cross-session false accepts, stale false accepts, duplicate executions, orphan count, cancellation-to-revocation latency.

## Verification
An independent reviewer repeats the negative cases from raw envelopes.

## Failure handling
Preserve evidence, disable automatic acceptance for the affected path, fall back to exact local human approval if supported.

## Stop conditions
Stop after all required negative cases pass or after the first security-boundary failure requiring implementation change. Maximum remediation/test cycles: 3.

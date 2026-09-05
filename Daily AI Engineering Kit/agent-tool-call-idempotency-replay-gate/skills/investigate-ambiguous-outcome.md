# Skill: Investigate Ambiguous Tool Outcome

## Purpose
Resolve a timeout/disconnect where a mutating tool may have committed even though the caller did not receive a result.

## Inputs
Idempotency key, request fingerprint, trace, provider request/correlation ID, logs, read APIs.

## Process
1. Freeze automatic replay for the affected key.
2. Preserve original request, timestamps, error, provider IDs, and trace.
3. Query read-only status/history APIs using the idempotency/provider key.
4. Look for a durable result matching the same request fingerprint.
5. If committed, record `committed` or `returned_cached` and return prior result.
6. If explicitly rejected/rolled back, record `failed`; retry only under normal bounded policy.
7. If still unknown, keep status `unknown`.
8. For high/critical risk, require explicit human approval before any replay.
9. After resolution, run deterministic gate and independent verification.

## Expected output
Resolution status, evidence, confidence, replay decision, approval requirement, residual risk.

## Verification
Never convert absence of evidence into proof of failure.

## Failure handling
Status-query transient failures retry at most twice. Permission failures stop.

## Stop conditions
Outcome remains unknown, evidence conflicts, or replay would cross an approval boundary.
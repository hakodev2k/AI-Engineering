# Skill: Shutdown Failure Recovery

## Purpose
Handle failed drain tests or interrupted work without hiding duplicate/lost side effects.

## Process
1. Classify failure as admission leak, premature termination, cancellation failure, ack/checkpoint failure, or environment/tool failure.
2. Preserve logs, timestamps, correlation IDs, and test artifacts.
3. For transient environment/tool failures, retry at most twice.
4. For implementation failures, change one hypothesis at a time and rerun the lifecycle test; maximum two cycles.
5. Confirm whether interrupted non-HTTP work is redelivered, resumed, compensated, or irrecoverably lost.
6. Verify idempotency before relying on redelivery.
7. Stop if recovery would require destructive data edits, manual production replay, infrastructure mutation, or security weakening without approval.

## Expected output
Failure class, evidence, recovery result, retry count, unresolved risk, escalation reason.

## Stop conditions
Retry budget exhausted, unknown side-effect state, permission failure, or human approval required.

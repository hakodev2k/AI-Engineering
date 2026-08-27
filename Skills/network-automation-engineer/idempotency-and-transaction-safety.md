# Idempotency and Transaction Safety

## Purpose
Make network automation safe to retry and recover after partial failures.

## When to use
Use for any workflow that mutates device or controller state, especially across multiple targets.

## Inputs
Desired state, current-state APIs, transaction capabilities, workflow steps, retry policy, and rollback semantics.

## Context to inspect
Candidate/commit support, checkpoints, API idempotency keys, device command behavior, and orchestration state persistence.

## Core knowledge
Retries are dangerous when operations are not idempotent. Transactions may be device-local while workflows span many systems; durable orchestration state is needed.

## Procedure
1. Define desired end state for every mutation.
2. Read current state before deciding action.
3. Prefer set-to-value over increment/append operations.
4. Use native transactions/checkpoints where available.
5. Persist workflow progress and correlation IDs.
6. Classify errors as retryable, terminal, or ambiguous.
7. Retry only bounded idempotent operations.
8. Re-read state after ambiguous timeouts.
9. Compensate/rollback explicitly when atomicity is unavailable.
10. Test interruption at every major step.

## Decision points
Use transaction commit when platform supports it; otherwise design saga-like compensation and verification. Never assume timeout means no change occurred.

## Common failure patterns
Blind retry, duplicate ACL entries, repeated sequence increments, rollback without current-state checks, and in-memory-only workflow state.

## Verification
Run repeated executions, inject timeouts after mutation, restart orchestrators, and prove convergence to one correct state.

## Expected output
Idempotent workflow, error taxonomy, durable state model, and recovery procedure.

## Stop conditions
Stop when post-timeout state cannot be determined or compensation could worsen an unknown partial state.
# Workflow: Failure Recovery

## Trigger
Circuit breaker returns `fail_fast` or compaction cannot preserve required context.

## Goal
Exit the failure loop without losing task state or weakening correctness requirements.

## Inputs
Circuit-breaker result, token budget breakdown, task requirements, available model capacities.

## Baseline
Record the final oversized input size, immutable-token size, attempts used, and last provider error.

## Stages
1. Stop all automatic retries for the same signature.
2. Preserve task state and required constraints.
3. Determine whether model routing to a larger compatible context is allowed and sufficient.
4. Otherwise decompose the task into independently verifiable smaller units.
5. Re-run preflight before any new model request.
6. Verify resulting output against the original acceptance criteria.

## Retry policy
One routed/decomposed recovery attempt per failure; no recursive recovery loop.

## Stop conditions
No compatible capacity exists, decomposition would lose required cross-context invariants, or recovery fails preflight.

## Failure path
Return the deterministic reason and measured budget mismatch for human/platform handling.

## Verification
Token Verifier confirms the recovery request fits budget and original requirements remain represented.

## Definition of Done
The repeated-signature loop is stopped, state is preserved, and any recovery request passes preflight with explicit verification.

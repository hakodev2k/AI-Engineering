# Skill: Remediate Delivery Risk

## Purpose
Apply the smallest safe change that restores atomic persistence, bounded dispatch, retryability, or duplicate safety.

## When to use
After discovery identifies a concrete outbox delivery defect.

## Inputs
Evidence contract, repository tests, acceptance criteria, policy.

## Preconditions
At least one defect hypothesis has direct evidence.

## Allowed tools
Repository edit, formatter/linter, unit/integration tests, local simulation, Git diff.

## Constraints
One hypothesis per implementation cycle; maximum three cycles. Do not broaden dependencies or change external contracts unless explicitly required.

## Procedure
1. Rank defects by potential message loss first, duplicate side effect second, operational inefficiency third.
2. Select one evidenced defect.
3. Prefer atomic outbox insert in the same transaction as the business write.
4. Preserve one event ID across dispatcher retries.
5. Mark delivered only after confirmed broker acknowledgement.
6. On failure, preserve the row, increment bounded retry metadata, and schedule a later attempt.
7. Use atomic claim/lease semantics for concurrent workers; expired claims must be recoverable.
8. Ensure consumer duplicate handling uses stable message identity or a domain-level idempotency key.
9. Add or strengthen tests for the defect and at least one crash/retry window.
10. Run repository-native tests and deterministic simulation.
11. Inspect diff for unrelated changes.
12. Hand off to an independent verifier.

## Expected output
Minimal diff, added/updated tests, commands run, evidence, and remaining risks.

## Verification
Remediation is not complete until final verification reports `verified`.

## Failure handling
Transient environment failures: two retries maximum. Build/test failure after a change: preserve output and either revise the same hypothesis or stop after cycle three.

## Stop conditions
Stop before schema migration execution, destructive data work, production changes, broker topology changes, secret changes, or weakening consistency/security controls without approval.
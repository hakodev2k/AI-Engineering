# Skill: Review Transaction Boundaries

## Purpose
Find partial-write, duplicate-side-effect, rollback, retry, and consistency risks caused by transaction boundaries that do not match the business operation.

## When to use
Use for changes involving multiple writes, EF Core/ORM transactions, message handlers, background jobs, external API calls mixed with persistence, retries, outbox/inbox, or concurrency-sensitive updates.

## Inputs
- Repository root and changed files.
- Business operation being implemented or reviewed.
- Persistence technologies and external side effects.
- Existing tests and retry/concurrency policy.

## Preconditions
Repository can be read. Tests/build commands are known or discoverable. Production mutation is not required.

## Allowed tools
Repository search/read, git diff, local build/test, `scripts/scan-transaction-risk.py`, `scripts/validate-assessment.py`.

## Constraints
Do not execute destructive SQL, mutate production data, alter schemas, deploy, or weaken consistency controls without explicit approval.

## Procedure
1. Identify operation entry points: controller/endpoint, command handler, consumer, job, service method.
2. Trace every database write and external side effect reachable from each entry point.
3. Mark transaction start, commit, rollback, savepoint, unit-of-work, and implicit ORM transaction boundaries.
4. Determine the business atomicity requirement: which state transitions must succeed or fail together.
5. Check whether external calls occur before commit, after commit, or through a durable outbox.
6. Inspect retry behavior. Verify a retry cannot duplicate email, message, payment, webhook, file write, or database mutation.
7. Inspect concurrency controls such as optimistic tokens, unique constraints, locking, compare-and-set, or idempotency keys.
8. Run `python scripts/scan-transaction-risk.py <repo> --json` and classify each signal as confirmed, false positive, or open question.
9. Inspect tests for rollback, second-attempt retry, concurrent execution, duplicate delivery, and external-side-effect ordering.
10. Form evidence-backed findings. Never label a heuristic scanner result as a confirmed defect without code/test evidence.
11. If implementation is requested, make the smallest safe change. Prefer established repository patterns over introducing a new transaction abstraction.
12. Run targeted tests, then broader relevant tests/build.
13. Inspect the diff for widened transaction duration, nested transactions, hidden side effects, new retry loops, or behavior changes.
14. Produce an assessment matching `schemas/assessment.schema.json` and validate it with `scripts/validate-assessment.py`.

## Expected output
A structured assessment with entry points, findings, evidence, severity, verification, unresolved risks, and approval state.

## Verification
A `pass` requires passing relevant tests, reviewed diff, no unresolved high/critical finding, and no required approval left unresolved.

## Failure handling
Tool/transient failures may be retried once. Implementation/test failures may enter the workflow fix loop up to two times. Preserve scanner output and test logs. Stop on permission errors or approval boundaries.

## Stop conditions
Stop when verified `pass`, after two failed fix/retest iterations, when evidence is insufficient to distinguish safe from unsafe behavior, or when an approval-required action is necessary.

# Detect Transaction-Boundary Side Effects

## Purpose
Find external or irreversible side effects whose success/failure can diverge from a database transaction.

## When to use
Use for feature work, bug fixes, incident analysis, or review when code both persists state and calls HTTP, queues, email, files, blobs, or other systems.

## Inputs
Diff base, changed files, transaction code, side-effect code, tests, and delivery guarantees.

## Preconditions
Repository is readable; Git diff is available. Production writes are not required.

## Allowed tools
Read/search repository, Git read commands, build/test tools, and `scripts/scan-side-effects.py`.

## Constraints
Treat scanner output as candidates, not proof. Do not execute external effects to validate them. Do not change schemas without approval.

## Procedure
1. Run `python scripts/scan-side-effects.py --base <base>` from the package root after adapting the script path to its installed location.
2. For each candidate, trace transaction begin, writes, commit/rollback, exception paths, and the external effect.
3. Record whether the effect happens before commit, after commit, or outside an explicit transaction.
4. Identify failure windows: effect succeeds/commit fails; commit succeeds/effect fails; retry duplicates effect.
5. Check existing idempotency, outbox, deduplication, compensation, and retry semantics.
6. Classify confirmed risks with file/line evidence and a reproducible failure scenario.
7. Recommend the smallest safe pattern: move effect after commit, transactional outbox, idempotency key, or explicit compensation.
8. Preserve unresolved assumptions as open questions.

## Expected output
Evidence-backed findings with failure window, affected component, risk, recommendation, and verification plan.

## Verification
A finding is confirmed only when control flow and transaction/effect ordering are supported by repository evidence or tests.

## Failure handling
If transaction ownership is unclear, stop classification and hand off the unknown boundary. If tooling fails, preserve stderr and do not infer a clean result.

## Stop conditions
Stop before production mutation, schema migration, destructive SQL, or any change requiring approval.

# Skill: Idempotency & Retry Safety Review

## Purpose
Detect duplicate-side-effect risk when code introduces or changes retries, message redelivery, scheduled/background work, API commands, payment actions, notifications, persistence, or external calls.

## When to use
Use before merge when a change touches retry policies, queue consumers, Hangfire/worker jobs, command handlers, webhook receivers, payment flows, email/SMS sending, storage writes, or any operation that can be executed more than once.

## Inputs
- Repository working tree and diff base.
- Acceptance criteria for expected retry behavior.
- Known external side effects and persistence operations.
- Existing deduplication/idempotency strategy, if any.

## Preconditions
- Repository can be inspected read-only.
- Relevant changed files are available.
- Tests may be executed locally or in CI.

## Allowed tools
Read/search repository files, run non-destructive build/test commands, execute `scripts/scan-retry-risk.py`, inspect diffs and test output.

## Constraints
- Treat retries and duplicate delivery as different failure modes; test both when applicable.
- Do not assume framework retry defaults are safe.
- Do not infer idempotency from method names alone.
- Production changes, schema changes, destructive data changes, payment behavior changes, or redelivery-policy changes require explicit human approval.

## Procedure
1. Run `python scripts/scan-retry-risk.py --base <base> --output .ai/idempotency-scan.json`.
2. Identify execution boundaries: HTTP endpoint, command, message consumer, job, scheduled task, callback, or external webhook.
3. Trace each boundary to all externally visible side effects: database writes, messages, notifications, files, payments, webhooks, cache mutations, and external API calls.
4. Identify every retry/redelivery path and its maximum attempts, trigger condition, backoff, ownership, and exception policy.
5. For each side effect, determine whether a duplicate invocation can occur before, during, or after failure acknowledgment.
6. Locate concrete guards such as unique constraints, processed-message tables, idempotency keys, compare-and-set state transitions, transactional outbox/inbox, or idempotent external-provider requests.
7. Create an assessment matching `schemas/assessment.schema.json`.
8. If a gap exists, propose the smallest guard that covers the confirmed duplicate path. Avoid broad refactors.
9. Add or update tests that execute the same logical operation twice and tests that fail after a side effect but before acknowledgment when the architecture allows it.
10. Run targeted tests, then broader relevant tests. Re-run after any fix. Maximum two implementation/retest cycles; preserve failing output after each cycle.
11. Inspect the final diff for unrelated changes and accidental weakening of retry/error handling.
12. Set assessment status to `pass` only when duplicate-delivery test, retry-path test, and diff review all pass.

## Expected output
An assessment JSON with scope, side effects, retry paths, evidence-backed findings, verification state, and open risks.

## Verification
Run `python scripts/validate-assessment.py <assessment.json>`. A passing assessment must have all required verification fields set to `pass`.

## Failure handling
- Tool/transient failure: retry at most twice and preserve stderr.
- Test failure: classify whether product defect, test defect, or environment failure; do not relabel as transient without evidence.
- Missing environment/dependency: mark `blocked` and report exact missing prerequisite.
- Approval-required fix: mark `needs-approval` and stop before the dangerous action.

## Stop conditions
Stop when verification passes, two fix/retest cycles fail, required evidence cannot be obtained, or a required approval has not been granted.

# Message Ordering Review Skill

## Purpose
Detect and remediate message-processing changes that can violate per-entity or per-stream ordering guarantees.

## When to use
Use for event consumers, queues, brokers, background handlers, retry/replay flows, parallel consumers, or changes to event versioning/partitioning.

## Inputs
- Changed files or target module
- Message/event contract
- Broker/queue configuration when available
- Ordering key or aggregate key
- Retry/replay behavior
- Existing tests and incident evidence

## Preconditions
- Repository is readable.
- Target consumer/publisher flow is identifiable.
- Required production-only changes are not executed without approval.

## Allowed tools
Repository search/read, static analysis, tests, local scripts, non-destructive broker/config inspection.

## Constraints
- Do not infer ordering from timestamps alone.
- Treat duplicate delivery and replay as normal conditions unless evidence proves otherwise.
- Separate observed facts from hypotheses.
- Do not change partition count, production broker config, retention, or event contracts without approval.

## Procedure
1. Locate publisher, transport adapter, consumer, persistence boundary, and downstream side effects.
2. Identify the ordering domain: aggregate/entity/tenant/workflow/global stream.
3. Identify the ordering key or partition key and verify that all related messages map consistently.
4. Identify sequence/version/offset semantics and the stale-message rejection rule.
5. Identify duplicate detection and idempotency storage scope.
6. Trace retries, dead-letter recovery, redelivery, replay, and backfill paths.
7. Inspect concurrency settings and parallel execution inside a single ordering domain.
8. Run `python3 scripts/scan-ordering-risk.py <target>` and record findings as evidence, not proof.
9. Create an ordering assessment using `schemas/ordering-assessment.schema.json`.
10. Implement the smallest safe change when requested: stable keying, monotonic version guard, atomic idempotency record, ordered dispatch, or per-key serialization.
11. Add or update tests for out-of-order, duplicate replay, stale event, and parallel consumers.
12. Run the relevant build/tests and `python3 scripts/validate-assessment.py <assessment.json>`.
13. Inspect the diff for contract/config changes and approval boundaries.
14. Handoff to the independent verifier.

## Expected output
A structured assessment with stream, ordering key, sequence strategy, duplicate/replay strategy, findings, evidence, recommended action, and verification results.

## Verification
A `pass` requires all four scenarios to be demonstrated: out-of-order, duplicate replay, stale event, and parallel consumer behavior.

## Failure handling
Transient tool failures may be retried twice. Build/test failures preserve logs and enter the workflow fix-retest loop, capped at two attempts. Permission or production-config requirements stop and escalate.

## Stop conditions
Stop on approval-required action, unknown ordering domain, ambiguous event version semantics, unavailable required evidence after bounded attempts, or exhausted fix-retest budget.

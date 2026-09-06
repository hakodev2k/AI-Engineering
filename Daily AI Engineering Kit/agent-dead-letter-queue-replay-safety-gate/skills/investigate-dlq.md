# Skill: Investigate Dead-Letter Queue

## Purpose
Build an evidence-backed picture of why selected messages were dead-lettered and whether replay can ever be safe.

## When to use
At the start of every replay request, before creating a replay plan.

## Inputs
Queue/topic name, environment, candidate message IDs, incident context, logs, handler code, broker metadata, schema/routing configuration.

## Preconditions
Read-only access to repository and enough message metadata to identify the failed set.

## Required context
1. Consumer/handler entry point.
2. Dead-letter policy and retry policy.
3. Schema/version handling.
4. Routing and tenant boundaries.
5. Idempotency/deduplication mechanism.
6. Relevant logs/tests for the original failure.

## Allowed tools
Repository read/search, log queries, broker read/peek/export operations, test execution, schema/config inspection.

## Constraints
Do not replay, delete, purge, mutate payloads, change broker configuration, or retrieve unnecessary secret/personal-data fields.

## Procedure
1. Freeze the candidate set by explicit message ID.
2. Record environment, source queue, destination/handler, tenant/account scope, enqueue/dead-letter timestamps, delivery count, correlation ID, and failure reason where available.
3. Trace the handler from transport entry point to external/database side effects.
4. Identify the exact failure class: transient dependency, code defect, schema mismatch, routing/config error, business-rule rejection, permission failure, poison payload, or unknown.
5. Collect evidence for the cause from logs, exceptions, tests, or broker reason metadata.
6. Determine what changed since failure: code commit, schema adapter, configuration correction, dependency recovery, credentials, or nothing.
7. Identify idempotency boundaries and all side effects that could repeat.
8. Check whether payload schema and routing semantics remain compatible with the current handler.
9. Check tenant/destination mapping independently from payload-provided claims where possible.
10. Classify each fact, hypothesis, open question, and blocking risk.
11. Hand only the bounded selected set and evidence to Replay Planner.

## Expected output
An investigation record containing selected message IDs, failure cause, fix/recovery evidence, idempotency evidence, compatibility state, tenant scope, unresolved risks, and recommended next action.

## Verification
Every replay-relevant claim links to repository, log, broker, test, schema, or configuration evidence. Unknown cause, unknown tenant scope, or unknown side-effect semantics remains blocking.

## Failure handling
Tool/permission failures preserve partial evidence and stop. Transient log/broker read failures may be retried twice. Missing evidence is never replaced with assumption.

## Stop conditions
Stop before replay if the original failure remains active, message scope is unbounded, idempotency cannot be established for material side effects, tenant scope is ambiguous, or replay would require a dangerous action without approval.

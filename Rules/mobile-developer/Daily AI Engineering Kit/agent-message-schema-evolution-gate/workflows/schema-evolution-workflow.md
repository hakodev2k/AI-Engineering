# Workflow: Safe Message Schema Evolution

## Trigger
A producer/consumer event or queue-message schema, serializer, envelope, enum, key, or field semantics change.

## Entry conditions
Repository is accessible; target message is identified; no production mutation is required for initial analysis.

## Inputs
Message name, proposed change, producer, known consumers, acceptance criteria, old/new schema or DTO, retention/replay requirements.

## Stages
1. **Context — Contract Explorer**: locate producer, serialization options, schema, consumers, subscriptions, tests, historical/replay paths. Output: investigation handoff.
2. **Compatibility baseline — Planner**: classify changes and run `python scripts/check-message-schema.py --old <old> --new <new> --message <name> --producer <producer> --consumer <consumer>... --output compatibility-report.json` where applicable.
3. **Plan — Planner**: define expand-migrate-contract rollout, compatibility window, cross-version matrix, rollback, observability, approvals.
4. **Execute — Implementation Agent**: make the smallest repository changes needed; no production mutation. Preserve old representation until planned retirement.
5. **Test — Implementation/Test Agent**: build, unit tests, serialization fixtures, old-consumer/new-producer and new-consumer/old-producer tests required by rollout; historical fixture tests when replayable data exists.
6. **Review — Independent Compatibility Verifier**: inspect checker output, consumer behavior, diff, hidden semantic/key/serializer changes, rollback and approvals.
7. **Verify — Compatibility Verifier**: set verification passed only when evidence is complete and no blocking incompatibility remains.
8. **Approval checkpoint**: stop before production replay, schema registry mode/write, broker/topic/subscription change, consumer cutover, DLQ reprocessing, destructive data operation, or breaking retirement.
9. **Complete**: produce compatibility report, rollout plan, test evidence, approval requirements, remaining risks.

## Checkpoints
- All discoverable consumers identified.
- Deterministic compatibility check completed when supported.
- Required cross-version tests defined before edits.
- Diff contains no unrelated change.
- Replay/retention risk assessed.
- Independent verification completed.

## Retry rules
Maximum 2 retries, only for transient tool/network/test-infrastructure failures. Preserve stdout/stderr and previous reports. Schema incompatibility, failed deterministic tests, permission failures, or missing consumer evidence are not retryable without new evidence/change.

## Failure paths
- Unknown consumer: status blocked; collect ownership/config evidence.
- Breaking change: use versioning or expand-migrate-contract; do not suppress finding.
- Historical fixture failure: block retirement/cutover; design compatibility adapter or version.
- Permission failure: stop without increasing permissions.
- Build/test regression: preserve evidence, attempt at most 2 targeted fixes, then escalate.

## Stop conditions
Any approval-required operation, unresolved breaking incompatibility, unknown material consumer, failed required test, or exhausted retry budget.

## Definition of Done
Producer and consumers are evidenced; compatibility result exists; rollout and rollback are explicit; required tests pass; replay safety is assessed; independent verifier passes; approvals are recorded for any dangerous action; no blocking failure remains.

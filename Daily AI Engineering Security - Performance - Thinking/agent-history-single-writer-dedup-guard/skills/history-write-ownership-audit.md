# Skill: History Write Ownership Audit

## Purpose
Identify every conversation-history persistence writer, quantify duplicate amplification, and establish one authoritative commit path.

## Trigger
Unexpected token growth, repeated transcript messages, tool-call pairing errors, new history/checkpoint middleware, or transport changes.

## Inputs
Persistence-event trace, component topology, token usage by turn, optional stored transcript export.

## Preconditions
Instrument without logging message bodies or secrets. Generate stable message IDs at creation if the framework lacks them.

## Required context
Conversation/session scope, all history loaders/writers, whether each operation is full snapshot, replace, or append delta.

## Allowed tools
Read-only traces, token/accounting telemetry, `scripts/history_write_guard.py`, unit/integration tests.

## Constraints
Do not delete context based only on matching text. Do not disable required durable history solely to save tokens. Do not call an optimization successful without before/after measurements.

## Procedure
1. Measure baseline turns on a fixed representative workload: input tokens, history rows/bytes, unique IDs, append events, provider errors.
2. Enumerate all components capable of append/replace/load.
3. Mark each writer `append`, `replace`, `observer`, or `disabled` and identify intended authority.
4. Run the guard on persistence events; record duplicate IDs and amplification ratio.
5. Trace one duplicated ID backward to every writer that committed it.
6. Form one root-cause hypothesis: competing writers, full-history-as-delta, lost history-management metadata, retry replay, or restore/reload duplication.
7. Implement the narrowest ownership/idempotency correction.
8. Re-run the same workload and guard; maximum two correction cycles.
9. Verify tool-call/result structural integrity and task quality, not only token reduction.
10. Handoff to independent verifier.

## Decision points
Multiple active append writers: block release. Same stable ID appended twice: block. Token reduction with missing required context or quality regression: reject optimization.

## Expected output
Ownership map, before/after metrics, duplicate-ID evidence, remediation and verification status.

## Metrics
Append amplification, duplicate commit rate, tokens/task, cost/task, bytes/session, quality/regression rate.

## Verification
One active append writer; no duplicate IDs; lower tokens/task where baseline duplication existed; unchanged critical context/tool pairing; tests pass.

## Failure handling
Retry at most twice with a changed hypothesis. If identity cannot be preserved, instrument stable IDs before further deduplication work. Escalate instead of deleting uncertain messages.

## Stop conditions
Verified single-writer/no-duplicate result, or stop after two failed corrections/any correctness regression.
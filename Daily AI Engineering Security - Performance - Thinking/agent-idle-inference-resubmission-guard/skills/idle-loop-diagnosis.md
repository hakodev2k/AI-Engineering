# Skill: Idle Inference Loop Diagnosis

## Purpose
Find why a worker keeps calling a model without observable progress and produce a measurable fix.

## Trigger
Unexpected quota drain, repeated identical model calls, large cached-input volume, inference after terminal state, or idle process network activity.

## Inputs
Request telemetry, worker state transitions, token usage, retry metadata, trigger/event IDs.

## Preconditions
Sanitize prompts/secrets; preserve timestamps and correlation IDs.

## Required context
Worker type, model, orchestration version, lifecycle state model, retry policy.

## Allowed tools
Log queries, JSONL analysis, profiler, unit/integration tests.

## Constraints
Do not infer causality from token totals alone. Do not expose prompt contents when metadata suffices.

## Procedure
1. Measure baseline request count, total input, cached input, output, and time-to-quiescence.
2. Correlate every inference request with the immediately preceding state/event transition.
3. Mark requests with no fresh trigger as idle candidates.
4. Group candidates by worker/thread/turn and detect repeated event or turn IDs.
5. Determine root cause: stale lifecycle state, timer-as-trigger, retry-state loss, duplicate event delivery, or missing terminal predicate.
6. Define a single admission predicate and bounded retry rule.
7. Replay a representative workload.
8. Compare before/after metrics and run legitimate-continuation fixtures.

## Decision points
If state evidence is incomplete, add telemetry before optimizing. If a request is needed for correctness but lacks a trigger representation, extend the trigger schema rather than bypassing the gate.

## Expected output
Facts, evidence, trigger map, root cause, admission rule, before/after metrics, residual risk, verification status.

## Metrics
Idle requests, cached idle tokens, time-to-quiescence, legitimate false blocks, tokens/task.

## Verification
Independent verifier confirms zero unexplained requests and no critical continuation regression.

## Failure handling
Maximum two remediation cycles; stop and escalate if lifecycle semantics remain ambiguous.

## Stop conditions
Verified quiescence invariant or explicit blocked status.
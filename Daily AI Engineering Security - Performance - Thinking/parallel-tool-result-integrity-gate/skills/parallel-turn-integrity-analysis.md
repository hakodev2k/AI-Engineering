# Skill: Parallel Turn Integrity Analysis

## Purpose
Diagnose whether an agent runtime preserves complete, correctly correlated tool state across parallel execution and pause/resume.

## Trigger
Missing tool output, repeated calls after apparent success, `Result unavailable`, approval/resume errors, unexpected max-step termination, or a new parallel execution path.

## Inputs
Raw model turn, tool-call events, tool-result events, approval events, runtime/session state, timestamps, idempotency metadata.

## Preconditions
Preserve raw traces. Redact secrets without changing call IDs. Do not re-run dangerous calls during diagnosis.

## Required context
Stable tool call IDs, lifecycle events, transport/session boundaries, and whether each tool is idempotent.

## Allowed tools
Trace/log readers, test harnesses, JSON validator, `scripts/verify_tool_batch.py`, safe mocked tools.

## Constraints
Never invent missing outputs. Never automatically replay a non-idempotent call without verified idempotency protection or human approval.

## Procedure
1. Extract each model-emitted tool call and stable `call_id`.
2. Extract every terminal result/denial/cancellation and its `call_id`.
3. Run the integrity checker on the captured turn.
4. Classify violations as missing, duplicate, unknown, overflow, or non-terminal.
5. Map the violation to runtime stages: model parsing, scheduler, executor, transport, approval checkpoint, hydration, or next-turn assembly.
6. Form one falsifiable hypothesis and reproduce with mocked deterministic tools.
7. Change one layer at a time; replay the same fixture.
8. Measure structural integrity, retries, calls, tokens, and latency.
9. Hand evidence to an independent verifier.

## Decision points
If any non-idempotent call has unknown completion state, stop and escalate. If only a result-delivery step failed and execution is known idempotent, allow one bounded replay. If call IDs are absent or unstable, fix instrumentation before optimization.

## Expected output
Facts, evidence, hypotheses, root cause, before/after integrity metrics, residual risks, verification status.

## Metrics
Missing/duplicate/unknown results; retries; calls/task; tokens/task; latency; completion rate.

## Verification
All emitted calls are terminally accounted for exactly once in replay and representative runtime traces.

## Failure handling
Maximum two diagnostic hypothesis cycles. If evidence remains ambiguous, stop with unresolved state rather than claiming success.

## Stop conditions
Unknown side effect of a non-idempotent call; missing trace identifiers; two failed hypotheses; or any recovery requiring weakened approval/security controls.
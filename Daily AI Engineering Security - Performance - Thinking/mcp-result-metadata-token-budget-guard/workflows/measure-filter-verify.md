# Workflow: Measure → Filter → Verify

## Trigger
Tool-result token budget exceeds target or repeated metadata is suspected.

## Goal
Lower model-context tokens while preserving correctness.

## Inputs
Raw result capture, context policy, quality checks.

## Baseline
Tokens/task, latency/task, calls/task, metadata ratio.

## Stages
1. Observe raw responses.
2. Measure metadata attribution.
3. Diagnose repeated paths.
4. Form a field-level filtering hypothesis.
5. Implement only the model-context projection change.
6. Replay same traces and measure again.
7. Independently verify quality/security invariants.

## Checkpoints
Baseline complete; field semantics reviewed; before deployment; post-replay.

## Retry policy
Maximum 2 filtering revisions.

## Stop conditions
Stop on correctness/security regression, unknown field semantics, or savings below minimum target after 2 revisions.

## Failure path
Revert projection to canonical content and keep profiler instrumentation.

## Verification
Run unit tests plus task-level replay.

## Definition of Done
Measured token reduction, unchanged canonical response, quality threshold met, reviewer pass.
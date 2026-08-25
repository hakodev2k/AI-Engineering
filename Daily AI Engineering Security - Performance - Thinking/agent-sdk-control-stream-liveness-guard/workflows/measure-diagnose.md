# Workflow: Measure and Diagnose

## Trigger
Repeated `Stream closed`, missing callback or stalled multi-tool execution.

## Goal
Establish whether premature transport teardown is the bottleneck/failure source.

## Inputs
Representative workload and lifecycle trace.

## Baseline
At least three runs when failure is intermittent. Record successful tool calls, failures, retries, turn latency, worker completion and close ordering.

## Stages
1. Observe and classify tool side effects.
2. Capture lifecycle events with monotonic timestamps.
3. Run trace guard.
4. Diagnose active dependents at close.
5. Form a lifecycle hypothesis.
6. Reproduce with one controlled change (for example streaming vs non-streaming) without treating workaround as fix.

## Responsible agent
Performance investigator.

## Tools
`control_stream_guard.py`, logs, test harness, profiler.

## Outputs
Baseline, root cause evidence, fix hypothesis.

## Checkpoints
After baseline; after trace validation; before implementation.

## Metrics
Failure/retry rates; p50/p95 latency; premature closes.

## Retry policy
Maximum three reproduction runs per configuration and two diagnosis cycles.

## Stop conditions
Premature close confirmed; another root cause confirmed; or evidence insufficient and instrumentation gap escalated.

## Failure path
If tracing perturbs timing, use minimal monotonic event logging and compare debug off/on rather than increasing verbosity indefinitely.

## Verification
A second reviewer can identify the same violating close from the trace.

## Definition of Done
Baseline and causal event ordering are recorded before optimization work begins.

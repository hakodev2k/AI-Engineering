# Skill — Cancellation Path Audit

## Purpose
Discover where cancellation is propagated, transformed, ignored, or lost across an agent execution path.

## Trigger
Use when adding a tool adapter, debugging hangs or late writes, introducing nested agents/resume streams, or before claiming cancellation support.

## Inputs
Call graph, runner configuration, tool adapters, stream/reconnect code, subprocess launcher, timeout settings, and representative traces.

## Preconditions
A reproducible run or test harness exists. Resource ownership boundaries are known or can be instrumented.

## Required context
Only code and traces related to run lifecycle, tool invocation, transport, cancellation, cleanup, and owned resources.

## Allowed tools
Repository search, static analysis, unit/integration tests, trace/log analysis, process inspection in a safe test environment.

## Constraints
Do not cancel unrelated host processes. Do not infer propagation merely because top-level APIs accept a token. Do not mark a path verified without an observed downstream cancellation event.

## Procedure
1. Map the path: caller → runner → model/stream → tool dispatcher → adapter → tool handler → transport/subprocess.
2. For each boundary record cancellation input, output, conversion, and ownership.
3. Inject cancellation at six checkpoints: pre-tool, tool-start, mid-I/O, mid-stream, reconnect/resume, nested/child process.
4. Capture timestamps for request, signal emission, tool observation, cleanup start, resource termination, and final settlement.
5. Detect late events after cancellation and classify them as benign cleanup, late result, state mutation, or leak.
6. Form a concrete hypothesis for each missing/late boundary and fix one boundary at a time.
7. Re-run the same fixtures and compare cancel-to-quiescence latency and leak counts.
8. Hand results to an independent verifier.

## Decision points
- Signal reaches handler but work continues: inspect tool cooperation and I/O cancellation.
- Handler stops but process remains: inspect descendant/process-group ownership.
- Stream hangs: inspect terminal event/rejection behavior.
- Resume path ignores cancel: inspect signal recreation and propagation.

## Expected output
A boundary matrix with `propagated`, `observed`, `quiescent`, `late_activity`, evidence, and remediation per execution path.

## Metrics
Propagation coverage %, p95 cancel-to-quiescence, active resources after grace period, late writes, leaked descendants.

## Verification
All required fixtures must pass twice in isolated runs, with no unexplained post-cancel activity.

## Failure handling
Retry instrumentation once for missing telemetry. Retry a remediation at most twice. If ownership is ambiguous, stop and escalate rather than killing unknown resources.

## Stop conditions
Stop when every required path is verified or when a blocking ownership/SDK limitation is documented with reproduction evidence.

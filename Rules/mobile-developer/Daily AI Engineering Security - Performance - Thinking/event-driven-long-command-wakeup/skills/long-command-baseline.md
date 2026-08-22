# Skill — Long Command Baseline and Diagnosis

## Purpose
Measure the true cost of long-command waiting and distinguish process runtime from orchestration overhead before optimizing.

## Trigger
Use when a command/tool exceeds the initial yield deadline, when token/credit use is unexpectedly high during waiting, or before changing wait orchestration.

## Inputs
Structured execution trace, process/session identifiers, model token deltas where available, wait/status tool calls, timestamps, output/progress events, terminal events, context size, and `config/wait-policy.json`.

## Preconditions
Trace timestamps are monotonic enough to order events. Copied/replayed histories are deduplicated when telemetry exposes them.

## Required context
Only execution and token telemetry relevant to the process. Large repository or conversation content is not required for deterministic timing analysis.

## Allowed tools
Log parsing, local scripts, metrics stores, process event streams, and `scripts/wait_budget_guard.py`.

## Constraints
Do not infer billed cost from raw token counters unless the source explicitly represents billing. Separate cached/raw/session traffic from user charges. Do not label a process hung solely because it is silent.

## Procedure
1. Identify the command start and first yielded-running event.
2. Identify all subsequent wait/status model turns until terminal collection.
3. Separate actual process wall time from completion-detection delay.
4. Count wait-only model turns and estimate their input/output token deltas.
5. Detect repeated no-progress responses and poll cadence.
6. Check whether authoritative completion/output events existed outside model turns.
7. Check whether deliverable/task completion occurred before cleanup polling.
8. Classify root cause: missing event wakeup, too-short poll cadence, stale handle, progress not surfaced, unbounded retry, or unknown.
9. Produce a baseline and a falsifiable optimization hypothesis.

## Decision points
- If authoritative completion events exist: prioritize event-driven wiring.
- If events do not exist: use bounded deterministic polling with backoff.
- If handle state is stale/inconsistent: reconcile state before further waits.
- If evidence cannot distinguish silent healthy from hung: do not auto-cancel.

## Expected output
Baseline with process wall time, wait-only turns, estimated wait tokens, polling cadence, no-progress count, completion-detection delay, event availability, root-cause classification, and hypothesis.

## Metrics
Wait-only turns/command, wait-token share, p50/p95 detection delay, no-progress polls, post-deliverable polls, and total task latency.

## Verification
A second analyst or deterministic parser can reproduce counts from the same trace. Before/after comparisons use equivalent workloads.

## Failure handling
Invalid/incomplete traces are marked insufficient evidence. Retry parsing once after correcting format; do not fabricate missing token or timing data.

## Stop conditions
Stop diagnosis when a supported root-cause hypothesis and baseline exist, or when missing telemetry prevents a defensible conclusion.

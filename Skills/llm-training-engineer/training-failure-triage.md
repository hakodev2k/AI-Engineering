# Training Failure Triage

## Purpose
Diagnose failed or degraded distributed training runs systematically and minimize wasted accelerator time.

## When to use
Use for crashes, hangs, NaNs, OOMs, throughput collapse, data-loader stalls, collective failures, or unexpected loss behavior.

## Inputs
Run configuration, logs, metrics, profiler traces, cluster events, checkpoint state, recent code/data changes.

## Context to inspect
First anomaly timestamp, affected ranks, infrastructure events, memory, collectives, data shard, numerical metrics, storage, and dependency versions.

## Core knowledge
The first visible error is often secondary. Senior triage reconstructs a timeline, distinguishes deterministic from transient failures, and reduces the problem before changing configuration.

## Procedure
1. Preserve logs and failing artifacts.
2. Identify the earliest deviation from a known-good run.
3. Classify failure: numerical, memory, communication, data, storage, process, or infrastructure.
4. Correlate rank-local and cluster events by time.
5. Compare configuration and artifact hashes with baseline.
6. Reproduce at smallest practical scale.
7. Bisect recent changes when reproducible.
8. Apply the narrowest fix.
9. Run a bounded canary before full restart.
10. Record root cause and prevention action.

## Decision points
Retry transient infrastructure faults only with bounded policy. Do not retry deterministic corruption or NaNs without diagnosis. Roll back when a recent change is strongly implicated and recovery time matters more than immediate root-cause completion.

## Common failure patterns
Infinite retries; deleting evidence; treating all OOMs as batch-size issues; debugging only rank zero; changing several knobs simultaneously.

## Verification
The canary survives the original failure window, targeted fault no longer reproduces, and metrics return to baseline.

## Expected output
A root-cause record, minimal fix, validation evidence, and prevention/monitoring improvement.

## Stop conditions
Escalate when hardware/storage integrity is suspect, production permissions are required, or repeated failures threaten checkpoints/data integrity.
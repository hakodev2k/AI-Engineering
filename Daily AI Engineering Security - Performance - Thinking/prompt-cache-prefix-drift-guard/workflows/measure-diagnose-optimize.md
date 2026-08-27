# Workflow: Measure → Diagnose → Optimize

**Trigger:** expensive resume or cache-write spike.  
**Goal:** remove avoidable prompt-prefix drift.

## Inputs
Session telemetry, baseline/candidate prompt-block metadata, input-token estimate.

## Baseline
Record cache-read tokens, cache-creation tokens, total input, latency, and task result.

## Stages
1. Observe the spike and preserve raw usage evidence.
2. Measure the baseline on a representative workload.
3. Run deterministic prefix fingerprint comparison.
4. Form one hypothesis for the first unstable block.
5. Implement the smallest safe layout or version-pinning change.
6. Measure the same workload again.
7. If not improved, re-evaluate once with new evidence.
8. Hand off to the independent Cache Verifier.

## Checkpoints
Before changing prompt order; before approving a costly resume; after the second measurement.

## Metrics
Cache-read ratio, cache-create tokens, estimated recache tokens, latency, task-quality regression.

## Retry policy
Maximum 2 optimization attempts.

## Stop conditions
Security/correctness context loss, unexplained drift, no measurable improvement, or exhausted attempts.

## Failure path
Restore the verified baseline. Start a fresh session when that is cheaper and safer than recaching.

## Verification
The independent verifier must reproduce the cache-break fixture and the improved workload metrics.

## Definition of Done
Measured reduction in avoidable cache creation with equivalent task quality and independent verification.

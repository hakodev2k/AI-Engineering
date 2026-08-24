# Workflow — Measure, Migrate, Verify

## Trigger
Long thread exceeds TTFT or size warning threshold.

## Goal
Restore TTFT SLO with correctness-preserving context management.

## Inputs
Thread snapshot, phase trace, workload class, SLO, required-context checklist.

## Baseline
Capture at least three turns when possible: history bytes/tokens, TTFT, first-tool timing, compaction timing.

## Stages
1. **Observe** symptom and preserve raw traces.
2. **Measure baseline** with `scripts/ttft_profiler.py`.
3. **Diagnose** whether delay is pre-model, model, or tool phase.
4. **Hypothesize** one size/context intervention.
5. **Optimize** via host-supported compact/fork/archive/externalization while retaining required context.
6. **Measure again** using equivalent workload.
7. **Improved?** If no, allow one second hypothesis; if still no, stop and escalate.
8. **Verify** independently against latency SLO and context checklist.

## Checkpoints
Before migration, after migration, before declaring success.

## Retry policy
Maximum 2 migration experiments per incident.

## Failure path
Keep original thread recoverable; do not destroy history to chase latency. Escalate with profiles and attempted changes.

## Metrics
p50/p95 TTFT, serialized bytes, prepare time, first-tool latency, compaction failures, correctness-regression rate.

## Definition of Done
Measured improvement meets SLO, context-retention checks pass, verifier signs off, and no blocking regression remains.

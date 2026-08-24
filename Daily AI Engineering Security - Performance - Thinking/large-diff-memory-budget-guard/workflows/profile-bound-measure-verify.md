# Workflow — Profile, Bound, Measure, Verify

## Trigger
Agent memory grows with edits, large change records appear in history, or a diff/event pipeline will process large/generated files.

## Goal
Bound memory and serialization amplification while preserving explicit, verifiable change evidence.

## Inputs
Repository/files, history JSONL, RSS measurements, event/record sizes, byte budgets, representative workloads.

## Baseline
Record peak RSS, largest file, largest diff/event/history record, task/session disk size, history hydration latency, and normal-file review outcome.

## Context
Map every copy/representation boundary from source file through tracker, diff renderer, event bus, logs, persistence, UI hydration, and child-agent context.

## Stages
1. **Observe** — collect a reproducing or representative workload.
2. **Measure baseline** — capture resource metrics before changes.
3. **Diagnose** — run `large_change_profiler.py`; identify where bytes first amplify materially.
4. **Hypothesize** — predict which early byte cap/reference fallback will reduce peak memory or record size.
5. **Optimize** — add budget before the expensive allocation/copy; preserve metadata/hash/reference.
6. **Measure again** — repeat the same workload and collect identical metrics.
7. **Improved?** — if not, permit one evidence-driven revision targeting the next amplification stage.
8. **Verify** — independent `memory-regression-verifier.md` reviews tests, metrics, and observability quality.

## Responsible agent
Performance implementer for stages 1–7; Memory Regression Verifier for stage 8.

## Tools
Process RSS telemetry, filesystem size/stat, history/event metrics, profiler, test runner.

## Outputs
Baseline, amplification map, hypothesis, implemented caps/fallbacks, before/after table, verification record.

## Checkpoints
Baseline exists; fallback is explicit; size guard occurs before full expensive representation; tests pass; peak/record metrics improve; normal changes remain reviewable.

## Metrics
Peak RSS, RSS/edit, max record/event/diff bytes, disk/session bytes, hydration latency, amplification ratio, review regression rate.

## Retry policy
Maximum one optimization revision after first before/after measurement. No unbounded tuning loop.

## Stop conditions
Verified bounds achieved; one revision fails; audit/correctness evidence is lost; or measurement is insufficient to support a claim.

## Failure path
Restore required observability, keep deterministic oversize detection, document the unbounded stage, and escalate. Do not solve memory pressure by silently deleting evidence.

## Verification
Run `python tests/test_large_change_profiler.py`, verify configured large-file/history fixtures block, then compare representative before/after resource metrics.

## Definition of Done
Evidence documented; baseline measured; root amplification stage identified; budget applied before expensive copies; large fixtures handled explicitly; peak memory/record size bounded or materially reduced; normal review passes; independent verification succeeds.

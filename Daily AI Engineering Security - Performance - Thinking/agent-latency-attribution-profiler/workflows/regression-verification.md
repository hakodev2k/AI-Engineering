# Workflow: Regression Verification

## Trigger
After latency optimization.

## Goal
Verify improvement is real, not shifted delay/degraded output.

## Inputs
Baseline/after traces, thresholds, correctness results.

## Baseline
Frozen pre-change report from same workload.

## Stages
Validate datasets -> compare coverage/sample counts -> compare every phase p50/p95 -> compare E2E/throughput -> compare failures/timeouts/retries/correctness -> verify approval remains separate/unchanged -> independent PASS/BLOCK.

## Metrics
Profiler metrics plus correctness/error rate.

## Retry policy
One rerun only for recorded transient benchmark noise.

## Stop conditions
PASS, confirmed regression, or incomparable datasets.

## Failure path
BLOCK claim; restore safe baseline if needed.

## Definition of Done
Comparable data, improvement target met, no shifted bottleneck or security/correctness loss.
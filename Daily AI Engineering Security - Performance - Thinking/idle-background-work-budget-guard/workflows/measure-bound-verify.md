# Workflow: Measure → Bound → Verify

## Trigger
Idle/background resource breach or startup maintenance responsiveness regression.

## Goal
Reduce unnecessary idle resource use while preserving required maintenance correctness.

## Inputs
Job registry, process samples, idle-state signal, budgets, correctness tests.

## Baseline
Capture at least a 60-second idle sample: process CPU seconds, wall seconds, RSS, I/O bytes, job events, workload size, and UI/event-loop latency if available.

## Stages
1. Observe and reproduce with no foreground task.
2. Measure baseline and rank resource consumers.
3. Diagnose overlap, polling, full-rescan, retry-loop, visibility-state, or ownership defects.
4. Form one measurable hypothesis.
5. Implement one change: debounce, watermark/incremental scan, concurrency cap, defer, cancellation, or circuit breaker.
6. Measure the identical scenario again.
7. If not improved, allow one changed hypothesis/remediation.
8. Independent Performance Verifier repeats benchmark and correctness tests.

## Responsible agent
Performance investigator implements; `subagents/performance-verifier.md` verifies.

## Tools
`scripts/idle_budget_analyzer.py`, OS/application telemetry, target-specific tests.

## Outputs
Baseline/post-change reports, offender diagnosis, breach events, verifier result.

## Checkpoints
Foreground task absent; workload size recorded; budget config fixed across comparison; no required integrity/security job removed.

## Metrics
Core-seconds/minute, RSS delta, I/O/minute, job duty cycle, overlap count, p95 duration, breach count, correctness pass rate.

## Retry policy
Maximum two remediation attempts per offender. Second attempt must address a different evidenced cause.

## Stop conditions
Unsafe cancellation, unknown owner, correctness regression, no improvement after two attempts, or verifier BLOCK.

## Failure path
Restore safe scheduling behavior, retain telemetry, disable only explicitly optional work with approval, and escalate the offender/job evidence.

## Definition of Done
Baseline exists; root cause identified; budget mechanism implemented; post-change measurement improves; configured idle thresholds pass; correctness tests pass; independent verifier passes; no security/integrity boundary is weakened.
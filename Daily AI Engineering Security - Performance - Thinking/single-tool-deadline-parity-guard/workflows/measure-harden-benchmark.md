# Workflow: Measure, Harden, Benchmark

## Trigger
New tool path or liveness finding.

## Goal
Bound stalled-call impact without regressing legitimate tool execution.

## Inputs
Executor paths, latency traces, deadline config, cancellation/retry implementation.

## Baseline
Measure normal latency distribution, stalled-call duration, turn recovery time, resource leakage, retry count.

## Stages
1. Observe and inventory paths.
2. Measure baseline.
3. Diagnose missing/asymmetric deadline semantics.
4. Form deadline/cancellation hypothesis.
5. Implement smallest cross-path fix.
6. Run stalled and slow-progress fixtures.
7. Measure again.
8. If improvement fails or false-timeout regression exceeds tolerance, re-evaluate once; max 2 cycles.
9. Independent verifier reproduces.

## Responsible agent
Performance investigator/implementer through stage 8; verifier stage 9.

## Tools
Checker, mock servers/tools, benchmark timer, process/socket inspection.

## Outputs
Path matrix, before/after metrics, diff, test logs, verification decision.

## Checkpoints
No path may be marked covered solely by an outer total-turn timeout if an inner call can own leaked resources.

## Metrics
P95/P99 latency; stalled recovery; orphan count; timeout rate; false timeout rate; task success.

## Retry policy
Two implementation/tuning cycles maximum. Timeout retries per tool follow explicit bounded config.

## Stop conditions
Stop on exhausted cycles, unsafe retry semantics, or inability to cancel/contain owned work.

## Failure path
Disable/isolate problematic tool path or wrap in killable worker; escalate.

## Verification
Independent replay demonstrates finite termination within tolerance and no regression beyond agreed threshold.

## Definition of Done
Implemented, measured, independently verified.
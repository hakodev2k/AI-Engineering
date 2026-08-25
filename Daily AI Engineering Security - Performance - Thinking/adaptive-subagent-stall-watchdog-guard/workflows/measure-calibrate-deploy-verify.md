# Workflow — Measure, Calibrate, Deploy, Verify

## Trigger
Evidence of false watchdog aborts or a planned timeout-policy change.

## Goal
Improve completion/throughput by distinguishing tail latency from true stalls.

## Baseline
Export representative gaps and record threshold, false-abort count, completion rate, retries, repeated tokens/tool calls, true-stall recovery time.

## Stages
1. **Observe** exact kill signatures and transport/progress state.
2. **Measure** with `calibrate_gaps.py` by model/effort/context cohort.
3. **Diagnose** false-positive versus genuine-stall populations.
4. **Hypothesize** an adaptive p99 envelope plus hard ceiling.
5. **Offline replay** historical observations through `watchdog_decision.py`.
6. **Implement** only after replay meets gates.
7. **Measure again** on comparable workload.
8. **Independent verify** tests, bounds, and before/after metrics.

## Metrics gates
False-abort rate must decrease for the target cohort; hard ceiling remains finite; true-stall detection p95 must not regress beyond the agreed ceiling; retry-amplified tokens/calls must not increase.

## Retry policy
Maximum two policy revisions. Identical retries are forbidden.

## Failure path
If no policy satisfies both false-abort and true-stall bounds, retain current runtime policy and escalate with evidence rather than raising timeout indefinitely.

## Definition of Done
Implemented, Measured, and Verified are all separately recorded; tests pass; boundedness proven; before/after comparison complete; no security/control boundary weakened.
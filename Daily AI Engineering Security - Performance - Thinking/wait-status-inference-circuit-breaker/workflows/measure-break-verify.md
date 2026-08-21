# Workflow: Measure → Break → Verify

## Trigger
Repeated wait/status calls or coordination-only inference above 10% of task turns.

## Goal
Reduce idle inference while preserving fast response to real state changes.

## Inputs
Tool-call trace, target states, token metrics, deadlines.

## Baseline
Capture coordination-turn count, no-progress token share, timeout ratio, useful completion latency, and false/stale target rate.

## Stages
1. Observe and baseline using `skills/wait-loop-profiling.md`.
2. Diagnose repeated signatures and stale targets.
3. Form one hypothesis: duplicate suppression, event wait, backoff, or breaker.
4. Implement only the selected mechanism.
5. Measure the same fixture again.
6. If not improved, revert/re-evaluate; maximum two optimization cycles.
7. Independent verifier checks state-change responsiveness and workload completion.

## Checkpoints
Baseline before changes; signature evidence before breaker policy; equivalent fixtures before comparison; independent verification before completion.

## Metrics
Coordination-only turns, input tokens, timeout count, completion latency, state-change reaction latency, false breaker count.

## Retry policy
Maximum two optimization cycles. A second cycle must target a different measured cause.

## Stop conditions
Stop if a breaker misses a real state change, delays required approval, terminates confirmed work, or fails to reduce coordination-only turns after two cycles.

## Failure path
Restore baseline behavior, retain metrics, and escalate with the exact signature/target state that defeated the guard.

## Definition of Done
Before/after evidence exists; coordination-only model turns and tokens decline; no useful event is lost; completion latency is non-regressive within configured tolerance; verifier returns PASS.
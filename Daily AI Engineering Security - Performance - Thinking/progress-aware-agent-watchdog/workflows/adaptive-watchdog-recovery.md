# Workflow: Adaptive Watchdog Recovery

## Trigger
Approaching a phase watchdog threshold, watchdog termination, silent stream, repeated tool loop, or retry after an agent/runtime stall.

## Goal
Keep finite stall protection while reducing false-positive termination and full-cost restarts.

## Inputs
Current phase, trace events, durable checkpoint, artifact hash, verification status, attempt number, token usage, elapsed time, prior retry signatures, and policy.

## Baseline
Before changing policy or recovery behavior, record false-positive kills, P50/P95 stall detection time, wasted retry tokens, retry-from-scratch rate, and recovery success rate over a representative workload.

## Context
Use recent operational trace plus durable checkpoint metadata; avoid reloading the entire transcript merely to decide liveness.

## Stages
1. **Observe — Orchestrator:** classify execution phase and collect timestamps/signals.
2. **Measure — Liveness Verifier:** compute progress score, budgets, checkpoint delta, and retry-signature count.
3. **Diagnose:** decide whether silence is transport-level, model-thinking, tool execution, build/test, or a no-progress loop.
4. **Hypothesize:** identify the least-destructive recovery: wait longer inside phase budget, cancel/reconnect stream, resume tool, or retry from checkpoint.
5. **Checkpoint:** persist verified state/artifact hash before terminating an attempt when feasible.
6. **Guard:** run `scripts/liveness_guard.py`.
7. **Act:** continue/wait/retry/stop according to guard decision.
8. **Measure again:** compare new attempt with prior checkpoint and signature; require new verified progress.
9. **Verify:** independent verifier confirms improvement and budget compliance.

## Responsible agent
Orchestrator owns lifecycle. Liveness Verifier owns classification/acceptance. Runtime implementation performs cancellation/resume/retry.

## Tools
Trace/log store, process/tool status, checkpoint storage, repository diff/hash, token metrics, deterministic guard.

## Outputs
Decision, phase, next patience window, progress score, checkpoint reference, retry signature, remaining budgets, before/after metrics, and final verification status.

## Checkpoints
- Phase classified.
- Hard timeout and token budgets loaded.
- Verified checkpoint captured before retry when policy requires it.
- Retry signature recorded.
- New attempt compared against prior progress state.

## Metrics
False-positive kill rate, wasted tokens, recovery latency, genuine-stall detection time, checkpoint-resume rate, identical-signature repetitions, and useful progress per minute/token.

## Retry policy
At most `max_total_attempts` total attempts (default 3). A retry must preserve/reuse a verified checkpoint where possible. Two identical no-progress signatures trigger the circuit breaker by default.

## Stop conditions
Hard task timeout, attempt budget, wasted-token budget, identical-signature threshold, corrupted/missing checkpoint when retry requires one, or unsafe process state.

## Failure path
Stop the autonomous run, retain logs/checkpoint/signatures, report the blocking state, and require operator action. Never hide failure by globally disabling watchdogs.

## Verification
Replay healthy-slow and genuine-stall fixtures, then compare baseline and candidate policy on the same workload. Improvement requires fewer false kills or less wasted retry cost without materially increasing genuine-stall detection time beyond the configured service objective.

## Definition of Done
Baseline captured; policy implemented; deterministic guard tests pass; retry loops bounded; checkpoint recovery verified; before/after metrics show improvement; no hard budget weakened without evidence; no blocking issue remains.
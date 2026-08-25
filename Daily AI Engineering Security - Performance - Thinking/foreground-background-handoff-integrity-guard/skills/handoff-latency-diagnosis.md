# Skill: Handoff Latency Diagnosis

## Purpose
Measure and diagnose foreground→background lifecycle stalls, duplicate execution risk, and model-visible polling overhead.

## Trigger
A long command yields/auto-backgrounds, completion is not observed reliably, duplicate commands appear, or background polling becomes expensive.

## Inputs
JSONL trace, acknowledgement deadline, notification deadline, comparable workload identifier.

## Preconditions
Trace records use stable command IDs and timestamps; baseline exists before optimization.

## Required context
Tool-runner lifecycle semantics and configured deadlines.

## Allowed tools
Read traces, run `scripts/handoff_guard.py`, compare metric outputs.

## Constraints
Do not mutate processes or reduce security/approval guarantees. Do not infer improvement without before/after evidence.

## Procedure
1. Collect a baseline trace.
2. Run the guard and capture acknowledgement/notification lag and violations.
3. Diagnose which boundary fails: transition acknowledgement, terminal correlation, notification, or recovery polling.
4. Form one testable hypothesis.
5. Change only the relevant lifecycle integration.
6. Replay a comparable workload and measure again.
7. Retry diagnosis/implementation at most twice.
8. Hand baseline/post-change evidence to the independent verifier.

## Decision points
Healthy baseline: stop unless a reproducible user-impact issue remains. Missing acknowledgement: fix transition durability. Missing notification: fix completion/wakeup correlation. Excess polls: prefer event wakeup or bounded backoff.

## Expected output
Baseline metrics, hypothesis, post-change metrics, violations, verification status.

## Metrics
Ack p95, notification p95, missing/late events, duplicate terminal events, polls while running/after terminal, total transition health rate.

## Verification
Same workload class, deadlines, and security policy must be used before and after.

## Failure handling
Preserve traces and stop after two failed improvement attempts; escalate rather than adding unbounded polling.

## Stop conditions
Verified measurable improvement with no lifecycle/security regression, or escalation after two unsuccessful retries.

# Skill — Replay Amplification Analysis

## Purpose
Diagnose agent retries that repeat expensive work without measurable progress and determine whether retry, checkpoint resume, request mutation, escalation, or stop is justified.

## Trigger
Use when a model/tool/subagent call repeats after failure, when a parent task remains running unusually long, or when tokens/tool calls rise sharply after the first failure.

## Inputs
Failure events, request fingerprints, retry counters, checkpoint IDs, progress markers, token estimates, tool-call counts, wall time, provider status, and logs.

## Preconditions
At least one failed attempt is observable. Logs must not expose secrets.

## Required context
Only events needed to reconstruct attempts and progress. Do not request hidden chain-of-thought; use observable model/tool events and outputs.

## Allowed tools
Log queries, tracing, token accounting, request hashing, workflow state inspection, and `scripts/retry_gate.py`.

## Constraints
- Establish a baseline before changing retry policy.
- Do not infer progress from repeated reasoning text; use committed outputs, checkpoints, completed tools, or state transitions.
- Do not retry a deterministic failure with identical input merely because attempt budget remains.
- Do not disable correctness or security checks to reduce latency.

## Procedure
1. Mark the first failure timestamp and attempt number.
2. Group subsequent attempts by normalized request fingerprint.
3. Record for each attempt: failure class, checkpoint, progress delta, input/output tokens, tool calls, and wall time.
4. Compute replay amplification: repeated/replayed tokens divided by useful completed-turn tokens where measurable.
5. Determine whether the next retry changes any causal input: provider availability, request payload, state/checkpoint, model route, or validated recovery action.
6. Classify each replay as useful recovery, identical no-progress replay, or full-turn replay from stale checkpoint.
7. Run the retry gate using the current budget.
8. If repeated failure is deterministic or unchanged, stop/escalate rather than replay.
9. If transient and within budget, resume from newest safe checkpoint whenever possible.
10. Re-measure recovery latency, replayed tokens, and successful completion after the change.

## Decision points
- Same fingerprint + no progress: allow at most the configured identical replay budget, then escalate.
- New checkpoint exists: prefer resume over full-turn replay.
- Failure evidence is transient and request/state changed: bounded retry is reasonable.
- Retry budget exhausted: stop even if the provider would otherwise auto-retry.

## Expected output
Attempt table, baseline metrics, identified replay root cause, falsifiable recovery hypothesis, retry-gate decision, after-change metrics, and residual risks.

## Metrics
Replay amplification ratio, duplicate fingerprint count, no-progress retries, post-failure tokens, post-failure tool calls, recovery latency, checkpoint-resume ratio, and false-stop rate.

## Verification
Reproduce a failing fixture, prove the new policy prevents unbounded replay, and verify a genuinely transient fixture can still recover within budget.

## Failure handling
Preserve sanitized traces. After two unsuccessful policy/implementation cycles, escalate instead of expanding retry budgets.

## Stop conditions
Stop when the task recovers within budget and regression tests pass, or when any configured attempt/token/tool/time budget is exhausted.

# Skill — Baseline and Burst-Budget Analysis

## Purpose
Measure tool-call burst behavior, diagnose waste, and tune a budget without reducing task correctness.

## Trigger
Use when a tool-using agent shows high call count, repeated polling, token spikes, delayed user-visible progress, or external API pressure.

## Inputs
JSONL tool-event trace, task class, baseline completion status, token estimates, latency, and `config/budget.json`.

## Preconditions
Trace timestamps and call classes are available; baseline tasks are reproducible; security policy is unchanged.

## Required context
Task acceptance criteria, framework-native step limits, expected legitimate parallelism, and retry semantics.

## Allowed tools
Trace readers, deterministic scripts, benchmark harnesses, test runners, and observability queries.

## Constraints
Do not infer performance improvement from fewer calls alone. Do not lower security controls or omit correctness-critical context.

## Procedure
1. Capture at least three representative baseline runs per fixture.
2. Record calls/turn, calls/minute, poll/retry share, estimated input tokens, latency, and final correctness.
3. Identify burst windows and label each call as progress, retry, poll, or approved fan-out.
4. Form a hypothesis for the dominant waste source.
5. Set an initial budget above normal productive p95 behavior but below observed pathological bursts.
6. Run the deterministic gate against baseline traces before integrating it.
7. Integrate the pre-tool hook and rerun the same fixtures.
8. Compare median and p95 metrics plus correctness and block reasons.
9. If productive fixtures are blocked, change one threshold or classification rule and rerun. Maximum two tuning retries.
10. Have a verifier independently confirm results.

## Decision points
- If low-value poll/retry traffic dominates, tighten its dedicated sub-budget first.
- If productive fan-out dominates, use bounded task-scoped fan-out allowance rather than raising all limits.
- If token cost rises without call-count growth, investigate context/prompt size separately.

## Expected output
Baseline/candidate table, chosen limits, blocked-call evidence, regressions, and verification status.

## Metrics
Calls/turn, calls/minute, poll/retry ratio, estimated input tokens/task, p50/p95 task latency, task success rate, false-positive block rate.

## Verification
A candidate qualifies only when waste metrics improve and representative task success is equal or better with zero critical false-positive blocks.

## Failure handling
Capture the offending trace, revert to the previous budget, classify the false positive, and retry tuning at most twice.

## Stop conditions
Stop after verification passes, after two unsuccessful tuning retries, or immediately if security/correctness regresses.

# Skill: Context Refill Analysis

## Purpose
Identify which observable context sources refill an agent window after compaction.

## Trigger
Repeated compaction, rapid token growth after compaction, or long-session latency/cost regression.

## Inputs
Trace with compaction event, active model window, per-source token counts, cache-read tokens, and input tokens.

## Preconditions
Trace source names are stable; task and system requirements are known.

## Required context
Facts and metrics only; hidden chain-of-thought is neither required nor requested.

## Allowed tools
Read-only tracing, token counters, `scripts/refill_guard.py`, test runner.

## Constraints
MUST NOT remove mandatory safety, policy, or task context merely to hit a token target.

## Procedure
1. Capture baseline over at least one compaction boundary.
2. Attribute post-compaction tokens to sources.
3. Compare total and static fractions with configured budget.
4. Form one falsifiable hypothesis for the largest avoidable source.
5. Apply one optimization: deduplicate, lazy-load, retrieve on demand, or narrow tool/agent registry.
6. Measure the same workload again.
7. Run quality/regression checks before accepting.

## Decision points
Reject an optimization if required context disappears or result quality regresses.

## Expected output
Facts, Evidence, Hypothesis, Before/After metrics, Decision, Risks, Verification status.

## Metrics
Tokens/task, refill fraction, static fraction, cache-read ratio, turns-to-next-compaction, latency.

## Verification
Independent verifier reviews source attribution and regression result.

## Failure handling
At most two optimization iterations; then fall back to fresh-session state transfer.

## Stop conditions
Required context alone exceeds budget, quality regression, or two failed optimization attempts.

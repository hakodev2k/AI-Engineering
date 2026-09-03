# Cost, Quality, and Latency Optimization

## Purpose
Balance competing routing objectives without sacrificing hard quality or reliability constraints.

## When to use
Use when several models are viable and route choice materially changes spend, response time, or task quality.

## Inputs
Per-model quality metrics, token and request prices, latency distributions, workload mix, SLOs, business-value estimates.

## Context to inspect
Traffic segments, context/output sizes, cache behavior, provider discounts, retries, tail latency, and failure cost.

## Core knowledge
Optimize total expected utility, not list price. Real cost includes retries, long outputs, failed calls, and operational overhead. Mean latency hides tails. Quality must be task-specific and statistically reliable.

## Procedure
1. Build a baseline by traffic segment.
2. Normalize model cost using observed token/output distributions.
3. Measure p50, p95, and p99 latency under representative concurrency.
4. Measure quality with task-specific evaluation sets.
5. Define hard floors for quality and reliability.
6. Identify Pareto-efficient candidates.
7. Simulate routing policies on historical traffic.
8. Quantify savings and regressions with confidence intervals.
9. Roll out gradually and compare realized outcomes.
10. Re-optimize when pricing, models, or workload mix changes.

## Decision points
Choose cheaper models only when quality remains above the required floor. Favor lower tail latency for interactive traffic and throughput efficiency for asynchronous jobs.

## Common failure patterns
Using benchmark list prices, ignoring retries, optimizing averages, comparing models on different evaluation sets, and treating all requests as equally valuable.

## Verification
Verify realized quality, cost per successful request, and latency distributions against the baseline and rollout guardrails.

## Expected output
A defensible routing optimization policy with measured trade-offs and segment-specific decisions.

## Stop conditions
Stop if quality measurements are too noisy or cost accounting cannot attribute retries and output size.
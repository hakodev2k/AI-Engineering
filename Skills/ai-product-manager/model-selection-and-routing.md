# Model Selection and Routing

## Purpose
Select and route among models based on task quality, latency, reliability, privacy, availability, and cost.

## When to use
Use when choosing a production model, evaluating provider changes, or designing multi-model routing.

## Inputs
Capability requirements, eval results, pricing, latency data, context limits, deployment options, privacy constraints, uptime requirements.

## Context to inspect
Provider contracts, region availability, rate limits, model versioning, fallback behavior, usage distribution, and switching costs.

## Core knowledge
The best model is workload-specific. Production choice must include output quality, tail latency, failure rate, token usage, safety, data handling, operational maturity, and lock-in.

## Procedure
1. Define representative workload slices.
2. Benchmark candidate models on product-specific evals.
3. Measure latency, throughput, cost, and structured-output reliability.
4. Review privacy, residency, retention, and security constraints.
5. Test rate limits, outages, and degraded-mode behavior.
6. Determine whether routing by task, risk, or complexity improves economics.
7. Define fallback models and compatibility requirements.
8. Document selection rationale and re-evaluation triggers.

## Decision points
Use one model when simplicity and consistency dominate. Use routing when workload heterogeneity creates material quality or cost gains that justify orchestration complexity.

## Common failure patterns
Selecting by public leaderboard only, ignoring tail latency, hard-coding provider-specific behavior, and using expensive models for trivial tasks.

## Verification
Run controlled evaluations on representative traffic and confirm fallback paths behave acceptably.

## Expected output
A model selection and routing decision with evidence, thresholds, fallback policy, and review triggers.

## Stop conditions
Stop when contractual, privacy, or evaluation gaps prevent a production-safe comparison.
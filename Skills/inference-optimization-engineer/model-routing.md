# Model Routing

## Purpose
Route requests across model variants, hardware pools, or serving tiers to balance quality, latency, reliability, and cost.

## When to use
Use when multiple model sizes or providers can satisfy different request classes, or when one serving pool cannot economically handle all traffic.

## Inputs
Model capability evaluations, request taxonomy, latency/cost measurements, traffic distribution, fallback policy, and quality thresholds.

## Context to inspect
Inspect routing features, confidence signals, prompt sensitivity, provider quotas, warm capacity, health state, data residency, and failure behavior.

## Core knowledge
Routing adds decision overhead and can create silent quality regressions. A useful router optimizes an explicit objective subject to hard constraints, and must be evaluated end to end rather than by classifier accuracy alone.

## Procedure
1. Define hard requirements and optimization objective.
2. Segment traffic by capability need and risk.
3. Establish quality/latency/cost baselines for each candidate model.
4. Select routing signals available before inference.
5. Build deterministic guardrails for sensitive classes.
6. Evaluate routing on held-out representative traffic.
7. Add health-aware fallback and quota handling.
8. Measure routing overhead and downstream tail latency.
9. Shadow-test before shifting production traffic.
10. Monitor route distribution, quality proxies, and fallback rates.

## Decision points
Use deterministic rules for high-risk, explainable constraints. Use learned routing when request patterns are complex and sufficient labeled outcome data exists. Keep a default high-capability path for uncertain cases if cost allows.

## Common failure patterns
Optimizing cost without quality guardrails, routing on unavailable features, feedback loops from biased labels, provider-specific assumptions leaking into business logic, and no safe fallback.

## Verification
Verified means offline evaluation and controlled production experiments demonstrate the expected objective improvement without breaching quality, latency, safety, or residency constraints.

## Expected output
Routing policy, traffic segmentation, evaluation evidence, fallback rules, and monitoring plan.

## Stop conditions
Escalate when quality thresholds are undefined, required routing signals contain prohibited data, or fallback capacity cannot support failure scenarios.
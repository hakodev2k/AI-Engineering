# Routing Evaluation and Benchmarking

## Purpose
Evaluate routing policies offline and online using workload-relevant metrics so route changes are evidence-based rather than anecdotal.

## When to use
Use when comparing routing strategies, adding models/providers, validating learned routers, or reviewing regressions.

## Inputs
Representative request corpus, ground truth or rubric, candidate policies, model outputs, latency/cost telemetry, safety metrics, and segment definitions.

## Preconditions
Evaluation data must represent production traffic sufficiently and avoid leakage from training or routing-policy development.

## Context to inspect
Existing eval suites, production distributions, judge methodology, human review, route attribution, and known failure segments.

## Core knowledge
Router quality is not identical to model quality. A router is successful when it selects appropriate models across heterogeneous requests under constraints. Evaluation must include oracle comparisons, regret, route distribution, constraint violations, and tail segments.

## Procedure
1. Define workload segments and success metrics.
2. Freeze a representative evaluation corpus.
3. Establish the current router baseline.
4. Execute all candidate policies against equivalent inputs.
5. Measure task quality, safety, latency, cost, and constraint compliance.
6. Calculate route distribution and per-segment regret when an oracle is available.
7. Inspect worst-case and rare high-impact segments.
8. Perform human review for ambiguous semantic outcomes.
9. Validate findings in shadow or canary traffic.
10. Version evaluation data and results.

## Decision points
Do not accept aggregate gains that hide critical segment regressions. Use automated judges only after calibrating them against human decisions for the workload.

## Common failure patterns
Benchmark-only traffic, evaluation leakage, inconsistent model settings, ignoring route-selection errors, and optimizing a single metric.

## Verification
Results are reproducible from versioned inputs, candidate policies, and model versions, with confidence or variance reported where meaningful.

## Expected output
A routing benchmark report with segment metrics, constraint violations, route distributions, and rollout recommendation.

## Stop conditions
Stop when evaluation data is unrepresentative, metric validity is disputed, or model/version drift makes comparisons invalid.
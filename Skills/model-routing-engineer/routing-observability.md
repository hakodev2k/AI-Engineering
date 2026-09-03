# Routing Observability

## Purpose
Make routing decisions, model outcomes, failures, latency, cost, and policy behavior observable enough to operate and improve the system safely.

## When to use
Use for every production router and whenever introducing new decision logic or providers.

## Inputs
Router events, model telemetry, usage records, traces, policy versions, request classifications, error taxonomy.

## Context to inspect
Existing logging/metrics/tracing stack, privacy constraints, sampling, correlation IDs, provider usage metadata, dashboards, and alerting.

## Core knowledge
Observe both the decision and the result. A model call metric without route reason cannot explain policy behavior. High-cardinality dimensions require care; sensitive prompts should not become default telemetry.

## Procedure
1. Define a canonical routing decision event.
2. Record policy version, candidate set, chosen route, reason code, fallback chain, and outcome.
3. Measure latency by router overhead and provider inference separately.
4. Attribute token usage and cost to route, tenant, and workload class where permitted.
5. Track errors, rate limits, fallbacks, abstentions, and degraded outcomes.
6. Create quality proxy and delayed-quality joins when available.
7. Build dashboards for model mix, cost, latency, reliability, and policy changes.
8. Add alerts on significant route-distribution and failure-rate shifts.
9. Validate telemetry under fallback and cancellation paths.

## Decision points
Sample verbose traces while keeping aggregate decision counters complete. Retain sensitive payloads only with explicit need and policy approval.

## Common failure patterns
No policy version, missing fallback events, double-counted costs, high-cardinality label explosions, and dashboards that show model health but not router behavior.

## Verification
Verify trace continuity, metric reconciliation against provider bills/usage, alert tests, and reproducibility of sampled routing decisions.

## Expected output
A routing observability specification plus validated dashboards, alerts, and trace fields.

## Stop conditions
Stop if required telemetry would violate privacy policy or if route decisions cannot be correlated with outcomes.
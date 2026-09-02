# AI Metrics Design

## Purpose
Design metrics that expose AI system health, quality proxies, capacity, and economics while remaining operationally actionable.

## When to use
Use when defining dashboards, alerts, SLO indicators, or instrumentation for an AI product.

## Inputs
User journeys, architecture, model endpoints, traffic profile, business criticality, cost model, and incident history.

## Context to inspect
Inspect existing metrics, labels, dashboards, alert rules, provider limits, queues, caches, retrieval, tools, and evaluation signals.

## Core knowledge
Metrics need clear semantics, units, ownership, and bounded cardinality. AI systems require conventional RED/USE signals plus token throughput, time-to-first-token, generation duration, context size, provider errors, fallback rate, cache behavior, retrieval/tool outcomes, and quality proxies. Metrics cannot prove semantic quality by themselves.

## Procedure
1. Identify critical user journeys and failure modes.
2. Define service health metrics before model-specific metrics.
3. Add latency distributions for end-to-end, TTFT, model, retrieval, and tools.
4. Add request, error, timeout, cancellation, retry, fallback, and saturation metrics.
5. Add input/output tokens, tokens per second, context utilization, and cost estimates.
6. Add bounded dimensions for model, provider, route, region, and outcome.
7. Define metric ownership and exact formulas.
8. Validate cardinality and storage cost under projected scale.
9. Build dashboards around questions responders actually ask.
10. Connect important metrics to SLOs and alerts.

## Decision points
Prefer histograms over averages for latency. Use logs/traces rather than labels for high-cardinality identifiers. Treat heuristic quality metrics as diagnostic signals, not ground truth.

## Common failure patterns
Averages hiding tails, unbounded labels, ambiguous denominators, duplicate metrics, cost estimates without token accounting, and dashboards with no operational question.

## Verification
Replay representative traffic and confirm units, dimensions, aggregation, percentiles, and cost calculations against raw evidence.

## Expected output
A metric catalog, instrumentation plan, dashboards, and documented formulas.

## Stop conditions
Stop when metric semantics cannot be defined consistently or data collection would violate privacy or cost constraints.
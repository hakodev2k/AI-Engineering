# Metrics Design and Cardinality

## Purpose
Design metrics that answer operational questions without causing uncontrolled series growth, query latency, or cost.

## When to use
Use when defining new metrics, reviewing label dimensions, or investigating metrics backend scale problems.

## Inputs
Operational questions, metric definitions, label sets, traffic distribution, backend limits, cost data.

## Context to inspect
Inspect dashboards, alerts, label cardinality, scrape intervals, aggregation rules, and top series contributors.

## Core knowledge
Know counters, gauges, histograms, summaries, exemplars, dimensional modeling, cardinality multiplication, aggregation, and histogram bucket trade-offs.

## Procedure
1. Start from decisions operators must make.
2. Choose the correct metric type and unit.
3. Define stable names and semantic labels.
4. Estimate worst-case cardinality before shipping.
5. Remove identifiers better suited to logs or traces.
6. Choose histogram boundaries from observed latency/value distributions.
7. Add recording rules for expensive repeated queries.
8. Set ownership and lifecycle expectations.
9. Test under representative scale.
10. Monitor series growth after rollout.

## Decision points
Use labels only for bounded dimensions needed for aggregation. Prefer exemplars or traces for per-request detail. Pre-aggregate when query cost matters more than raw flexibility.

## Common failure patterns
User IDs as labels, dynamic URLs, redundant metrics, inconsistent units, poorly chosen buckets, and no metric retirement process.

## Verification
Measure active series, ingestion rate, query latency, backend memory, and whether target operational questions are answerable.

## Expected output
A bounded, documented metric schema with expected cardinality and validation evidence.

## Stop conditions
Stop if dimensions are unbounded, semantics are ambiguous, or backend limits cannot support the estimated series count.
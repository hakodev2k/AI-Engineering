# Cardinality Management

## Purpose
Control telemetry dimensionality so metrics and logs remain useful, performant, and economically sustainable.

## When to use
Use when designing labels, investigating telemetry cost spikes, or fixing slow/high-memory monitoring systems.

## Inputs
Metric schemas, log fields, trace attributes, backend limits, query patterns, and billing model.

## Context to inspect
Inspect unique label values, series growth, tenant/user/resource identifiers, ephemeral infrastructure labels, and unused dimensions.

## Core knowledge
Metric cardinality grows multiplicatively across labels. High-cardinality context may be valuable in traces or logs but dangerous in indexed metric dimensions.

## Procedure
1. Measure current series and field cardinality.
2. Rank dimensions by operational value and cost.
3. Identify unbounded identifiers.
4. Remove, bucket, aggregate, or relocate them.
5. Define approved label schemas and limits.
6. Add monitoring for series growth.
7. Validate key queries after changes.
8. Document exceptions and ownership.

## Decision points
Keep dimensions needed for alerting or stable segmentation; move request-, user-, session-, or object-level identifiers to trace/log context.

## Common failure patterns
User IDs in metrics, raw URLs instead of route templates, pod IDs retained forever, arbitrary tags, and cost controls that destroy necessary diagnostic context.

## Verification
Compare series counts, query latency, cost, and diagnostic coverage before and after changes.

## Expected output
Bounded telemetry schemas with measurable cardinality budgets and guardrails.

## Stop conditions
Escalate when removing a dimension would invalidate contractual reporting or critical SLO calculations.
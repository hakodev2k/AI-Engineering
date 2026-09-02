# Telemetry Cardinality Management

## Purpose
Control metric and trace cardinality so AI observability remains performant and economically sustainable.

## When to use
Use when adding dimensions, experiencing telemetry cost spikes, or seeing slow/failed observability queries.

## Inputs
Metric schemas, label value counts, trace attributes, traffic scale, retention, backend limits, and cost data.

## Context to inspect
Inspect user/tenant IDs, prompt hashes, document IDs, tool arguments, model names, dynamic routes, error strings, and experiment identifiers.

## Core knowledge
Cardinality grows multiplicatively across labels. Metrics require bounded dimensions; high-cardinality diagnostic data belongs in logs/traces or dedicated analytical stores. Even traces can become expensive when attributes and events are unbounded.

## Procedure
1. Inventory telemetry dimensions and estimate unique values over retention windows.
2. Identify unbounded fields and remove them from metric labels.
3. Normalize dynamic routes, errors, and tool names into stable categories.
4. Keep request IDs, document IDs, user IDs, and prompt hashes in searchable event data only when justified.
5. Define per-signal budgets for series count, event size, and sampling.
6. Add monitoring for telemetry volume and rejected/dropped data.
7. Load-test proposed schemas at projected scale.
8. Review dimensions periodically as models, tools, and experiments expand.

## Decision points
Use exemplars or trace links to bridge low-cardinality metrics to high-cardinality diagnostics. Aggregate tenant classes instead of tenant IDs unless dedicated billing telemetry requires otherwise.

## Common failure patterns
User IDs in metrics, raw error messages as labels, one label per experiment flag, dynamic URL paths, and solving cardinality only by shortening retention.

## Verification
Measure series counts and ingestion volume before/after; confirm diagnostic workflows still reach representative traces or logs.

## Expected output
A cardinality budget, corrected schemas, telemetry-volume monitors, and documented exceptions.

## Stop conditions
Stop if removing a dimension would break a regulatory/billing requirement without an alternative data path.
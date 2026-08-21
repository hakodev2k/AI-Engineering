# Data Serving and Consumption

## Purpose
Publish data in forms that downstream analytics, applications, and machine-learning consumers can use reliably without coupling to internal pipeline details.

## When to use
Use when exposing curated tables, semantic models, extracts, feature datasets, APIs, or low-latency analytical stores.

## Inputs
Consumer use cases, query patterns, latency/freshness needs, concurrency, contracts, security, and expected volume.

## Context to inspect
Inspect consumer tools, current access paths, semantic definitions, concurrency, caching, row-level security, and downstream failure tolerance.

## Core knowledge
Serving models are contracts. Optimize them for consumer semantics and access patterns while insulating consumers from unstable internal staging structures.

## Procedure
1. Identify consumer personas and critical queries.
2. Define stable dataset grain and semantics.
3. Choose serving technology by latency, concurrency, and query shape.
4. Publish only governed fields and metrics.
5. Define freshness and availability objectives.
6. Apply access controls at appropriate granularity.
7. Add indexes, clustering, aggregates, or caching based on measurements.
8. Version breaking contract changes.
9. Monitor usage, latency, freshness, and errors.
10. Deprecate unused serving surfaces deliberately.

## Decision points
Use warehouse/lakehouse tables for flexible analytical access; use specialized serving stores or APIs when latency, concurrency, or isolation requirements justify duplication.

## Common failure patterns
Consumers reading staging tables, metric logic duplicated in every dashboard, unstable schemas, unlimited expensive queries, and serving sensitive columns merely because they exist upstream.

## Verification
Run representative consumer queries, validate access boundaries, compare metrics to authoritative definitions, and test freshness plus compatibility expectations.

## Expected output
A stable, governed serving contract optimized for actual consumer workloads.

## Stop conditions
Stop when consumer semantics conflict, required latency cannot be met by the selected platform, or access policy is unresolved.
# Feature Engineering and Point-in-Time Correctness

## Purpose
Create predictive recommendation features without leakage or training-serving skew.

## When to use
Use when adding or reviewing user, item, context, aggregate, or cross features.

## Inputs
Feature definitions, source tables/streams, event timestamps, serving architecture, and label timestamps.

## Context to inspect
Availability time, update cadence, null behavior, identity joins, feature ownership, TTLs, and backfill semantics.

## Core knowledge
A feature is valid only if it could have been known at decision time. Event time and processing time differ. Aggregates require cutoff-aware computation and reproducible definitions.

## Procedure
1. Define feature semantics, owner, type, and freshness need.
2. Identify source timestamp and availability delay.
3. Implement point-in-time joins against decision timestamps.
4. Define defaults and missingness indicators where useful.
5. Compute train and serve values through shared definitions where possible.
6. Test backfills and late events.
7. Measure drift, null rate, cardinality, and serving latency.
8. Remove features whose incremental value does not justify operational cost.

## Decision points
Use online features only when freshness adds measurable value; precompute stable features. Prefer simpler robust aggregates over fragile high-cardinality crosses unless lift is demonstrated.

## Common failure patterns
Future leakage, mutable backfills, inconsistent windows, timezone errors, silent defaults, and offline-only features.

## Verification
Run historical point-in-time tests, compare offline/online feature samples, and verify freshness and null SLOs.

## Expected output
Documented feature definitions with reproducible computation and parity evidence.

## Stop conditions
Stop if source timestamps are insufficient to prove causality or serving cannot reproduce required values.
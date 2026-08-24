# Feature Store Operations

## Purpose
Operate reusable ML features with consistent definitions, freshness, access control, point-in-time correctness, and online/offline parity.

## When to use
Use when multiple models share features, online inference needs low-latency feature lookup, or training-serving skew is a recurring risk.

## Inputs
Feature definitions, entities, event timestamps, SLAs, source data, consumers, latency and freshness requirements.

## Preconditions
Feature ownership and semantic definitions are explicit.

## Context to inspect
Offline pipelines, online store, materialization jobs, schemas, backfills, TTLs, access policies, monitoring, and consumer contracts.

## Core knowledge
Features are data products. Point-in-time joins prevent leakage; event time differs from processing time; online and offline values must derive from equivalent logic.

## Procedure
1. Define entity keys and feature semantics.
2. Specify event-time and freshness contracts.
3. Implement point-in-time-correct offline computation.
4. Define online materialization and TTL behavior.
5. Validate offline/online parity.
6. Add schema and range checks.
7. Define backfill and late-data behavior.
8. Apply least-privilege access.
9. Monitor freshness, null rates, lookup latency, and parity.
10. Version breaking semantic changes.

## Decision points
Feature store vs ordinary data pipelines; push vs pull materialization; precompute vs on-demand computation.

## Common failure patterns
Label leakage, stale features, mismatched transformation code, reused names with changed semantics, silent defaults, and hotspot entity keys.

## Verification
Replay representative entities and compare training-time and serving-time values within defined tolerances.

## Expected output
Feature contracts, materialization plan, parity tests, monitors, ownership, and deprecation policy.

## Stop conditions
Stop if semantic ownership is unclear, point-in-time correctness cannot be guaranteed, or sensitive features lack approved access controls.
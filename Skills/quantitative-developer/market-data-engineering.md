# Market Data Engineering

## Purpose
Build reliable pipelines for prices, quotes, trades, reference data, and corporate actions without corrupting research or trading decisions.

## When to use
Use when onboarding a feed, repairing data quality, or designing research/trading datasets.

## Inputs
Feed specifications, schemas, timestamps, calendars, sample data, downstream requirements, and quality incidents.

## Preconditions
Identify asset classes, venues, licensing constraints, and authoritative sources.

## Context to inspect
Existing ingestion jobs, symbol mapping, time zones, adjustment rules, storage layout, consumers, and SLAs.

## Core knowledge
Market data is temporal and revision-prone. Distinguish event, exchange, receive, and processing time. Handle corporate actions, identifier changes, stale quotes, crossed markets, duplicates, gaps, and survivorship bias explicitly.

## Procedure
1. Define canonical instruments and timestamp semantics.
2. Map vendor fields to a versioned internal schema.
3. Preserve raw immutable observations.
4. Normalize calendars, currencies, units, and identifiers.
5. Detect duplicates, gaps, outliers, stale values, and ordering defects.
6. Apply adjustments only in derived datasets with provenance.
7. Partition and index for expected access patterns.
8. Record lineage and feed versions.
9. Add quality metrics and alerts.
10. Replay representative periods and compare with an independent source.

## Decision points
Prefer lossless raw storage before normalized views. Choose streaming for latency-sensitive consumers and batch when deterministic completeness matters more. Do not silently forward-fill fields whose economic meaning changes.

## Common failure patterns
Look-ahead from revised data, wrong timezone conversion, unadjusted splits, symbol collisions, survivorship bias, hidden vendor corrections, and non-idempotent ingestion.

## Verification
Prove completeness over trading calendars, reconcile sampled instruments with source records, test replay idempotency, and validate downstream calculations around corporate actions.

## Expected output
A documented, replayable, monitored dataset with explicit provenance and quality evidence.

## Stop conditions
Escalate when licensing forbids storage, authoritative mappings conflict, timestamps are semantically ambiguous, or corrections cannot be reconciled.
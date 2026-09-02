# Temporal and Versioned Knowledge

## Purpose
Model facts that change over time so the graph can answer current, historical, and effective-time questions without overwriting evidence.

## When to use
Use for contracts, ownership, organizational structure, prices, statuses, regulations, observations, or any domain where truth is time-dependent.

## Inputs
Event timestamps, validity intervals, source timestamps, correction semantics, retention requirements, and query needs.

## Preconditions
Distinguish event time, valid time, ingestion time, and correction time where applicable.

## Context to inspect
Current overwrite behavior, backfilled data, late events, timezone handling, interval boundaries, source corrections, and historical query requirements.

## Core knowledge
A temporal graph should distinguish when a fact was true from when the system learned it. Bitemporal designs are justified when both business-valid time and system-recorded time must be audited.

## Procedure
1. Identify which facts are time-varying.
2. Define temporal semantics per fact type.
3. Choose point events versus validity intervals.
4. Define inclusive/exclusive interval boundaries.
5. Preserve prior assertions instead of destructive overwrite where history matters.
6. Handle late-arriving and corrected facts explicitly.
7. Prevent overlapping intervals where domain rules forbid them.
8. Add indexes or partitions for temporal access patterns.
9. Test current-state and as-of queries.
10. Define retention and compaction policy.

## Decision points
Use simple effective dates when audit needs are limited; bitemporal modeling when retroactive corrections and historical audit must coexist. Materialize current state if temporal reconstruction is too expensive for frequent reads.

## Common failure patterns
Confusing ingestion and effective time; open-ended intervals with inconsistent sentinels; destructive corrections; timezone drift; and overlapping validity ranges that create contradictory truth.

## Verification
Run as-of queries across boundary cases, late events, corrections, and historical snapshots. Confirm current state matches canonical expectations.

## Expected output
Temporal modeling rules, versioning strategy, query patterns, and regression tests.

## Stop conditions
Stop when the business cannot define temporal truth semantics or retention requirements conflict with legal obligations.
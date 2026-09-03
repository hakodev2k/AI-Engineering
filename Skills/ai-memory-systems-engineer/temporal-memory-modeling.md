# Temporal Memory Modeling

## Purpose
Represent when a memory became true, when it was observed, and when it ceased to be valid so retrieval does not surface stale information as current fact.

## When to use
Use for preferences, employment, locations, memberships, plans, recurring tasks, changing attributes, and event histories.

## Inputs
Memory records, event timestamps, source timestamps, update events, validity rules, retrieval requirements.

## Preconditions
Distinguish event time, ingestion time, and validity time.

## Context to inspect
Timestamp sources, timezone handling, source ordering, late-arriving events, user corrections, and supersession metadata.

## Core knowledge
Temporal correctness requires more than a created_at field. Bitemporal concepts are useful when the time a fact is true differs from the time the system learned it.

## Procedure
1. Define temporal fields per memory type.
2. Normalize timestamps and timezones.
3. Identify open-ended versus bounded validity.
4. Define update and supersession semantics.
5. Handle late and out-of-order observations.
6. Preserve historical versions where required.
7. Make retrieval time-aware.
8. Add stale-memory penalties or exclusion rules.
9. Test historical and current queries.
10. Monitor temporal inconsistency rates.

## Decision points
Use versioned history when auditability or temporal reasoning matters. Use in-place updates only for low-risk mutable state where history has no value.

## Common failure patterns
Conflating ingestion and event time; silently overwriting history; timezone errors; treating future plans as current facts.

## Verification
Test queries at multiple reference times and verify returned memories match the expected historical state.

## Expected output
A temporal memory model with validity, supersession, and retrieval rules.

## Stop conditions
Stop when source timestamps are unreliable and no acceptable fallback semantics exist.
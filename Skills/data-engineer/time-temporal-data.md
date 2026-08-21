# Time and Temporal Data Engineering

## Purpose
Handle timestamps, time zones, intervals, effective dates, and historical truth consistently across ingestion and analytics.

## When to use
Use whenever pipelines process event times, schedules, daily partitions, business calendars, historical dimensions, or cross-region data.

## Inputs
Source timestamp semantics, timezone information, business calendar, daylight-saving rules, event/effective dates, and consumer expectations.

## Context to inspect
Inspect field types, timezone offsets, source system locale, UTC conversion, partition boundaries, late events, and existing date dimension conventions.

## Core knowledge
An instant, local wall-clock time, date, and business period are different concepts. Store instants with unambiguous timezone/offset semantics; preserve original context when business interpretation depends on it.

## Procedure
1. Classify each temporal field by meaning.
2. Identify source timezone and ambiguity.
3. Normalize instants consistently while retaining required local context.
4. Define inclusive/exclusive interval boundaries.
5. Use authoritative timezone databases rather than fixed offsets where DST exists.
6. Define event time versus ingestion time.
7. Handle late and corrected events explicitly.
8. Centralize fiscal/business calendar logic.
9. Test DST transitions, month/year boundaries, and leap days.
10. Document partition-date semantics.

## Decision points
Use UTC for cross-system instants; use local dates/times when the business concept itself is local. Preserve both when conversion must remain auditable.

## Common failure patterns
Assuming server local time, storing ambiguous timestamps, fixed UTC offsets for DST regions, inclusive end timestamps causing overlap, and partitioning by ingestion date when consumers require event date.

## Verification
Test known timezone transitions and boundary records, compare source/local/UTC representations, and verify daily aggregates around DST changes.

## Expected output
Explicit temporal semantics with consistent conversion, interval, partition, and historical behavior.

## Stop conditions
Escalate when source timestamps lack enough information to resolve required business time semantics reliably.
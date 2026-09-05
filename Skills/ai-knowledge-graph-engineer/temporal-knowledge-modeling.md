# Temporal Knowledge Modeling

## Purpose
Model how entities, relationships, and assertions change over time so graph queries can distinguish current state from historical truth.

## When to use
Use for contracts, employment, ownership, product states, medical facts, regulations, event histories, or any domain where validity changes over time.

## Inputs
Business temporal semantics, event timestamps, source timestamps, expected historical queries, correction rules.

## Preconditions
Clarify event time, ingestion time, and business-valid time before implementation.

## Context to inspect
Current timestamp fields, event sources, update logic, query patterns, retention policy, provenance.

## Core knowledge
Temporal graphs often need valid time and transaction time. Overwriting current values destroys auditability. Interval semantics, boundary conventions, late events, and corrections must be explicit.

## Procedure
1. Identify facts with temporal lifecycle.
2. Define time dimensions and timezone conventions.
3. Choose interval or event representation.
4. Define open/closed interval boundaries.
5. Preserve historical assertions rather than overwrite.
6. Handle late and corrected observations.
7. Align provenance with temporal assertions.
8. Implement current-state and as-of queries.
9. Test overlapping and contradictory intervals.
10. Document correction and retention policy.

## Decision points
Use events when state can be derived reliably; use explicit validity intervals when as-of queries dominate or derived state is expensive.

## Common failure patterns
One timestamp for multiple meanings, destructive updates, ambiguous interval boundaries, ignoring timezones, and treating ingestion order as business chronology.

## Verification
Validate current-state, historical, late-arrival, correction, and overlap scenarios against known examples.

## Expected output
A temporal model, update rules, query patterns, edge-case tests, and migration guidance.

## Stop conditions
Escalate when authoritative sources disagree about historical truth or legal retention prevents the intended correction strategy.
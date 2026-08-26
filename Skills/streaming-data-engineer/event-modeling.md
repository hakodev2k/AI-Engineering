# Event Modeling

## Purpose
Create business-meaningful, stable event contracts that preserve intent without leaking implementation details.

## When to use
Use when introducing or redesigning domain events, integration events, or CDC-derived contracts.

## Inputs
Domain model, business processes, producer state transitions, consumer needs, current schemas.

## Context to inspect
Existing naming conventions, ownership boundaries, schema registry, compatibility policy, PII classification.

## Core knowledge
Events describe facts that happened. Good contracts carry stable identity, occurrence time, correlation/causation metadata, semantic version expectations, and only data justified by consumers. Integration events should not mirror internal tables blindly.

## Procedure
1. Identify the business fact and authoritative owner.
2. Separate commands from events.
3. Name events in past tense using domain language.
4. Define immutable identity and timestamps.
5. Add correlation and causation metadata where useful.
6. Minimize payload while avoiding chatty enrichment dependencies.
7. Classify sensitive fields.
8. Define schema and compatibility expectations.
9. Review representative consumer use cases.
10. Test serialization and evolution scenarios.

## Decision points
Use notification events when consumers can safely fetch state; use event-carried state when autonomy and resilience justify duplication. Prefer domain semantics over database-row semantics.

## Common failure patterns
Generic `updated` events; unstable identifiers; ambiguous timestamps; leaking internal columns; oversized payloads; missing ownership; embedding secrets.

## Verification
Validate examples with producer and consumer tests, schema rules, privacy review, and backward/forward evolution cases.

## Expected output
A documented event contract with semantics, ownership, examples, and compatibility policy.

## Stop conditions
Stop if ownership, authoritative meaning, or sensitive-data policy cannot be established.
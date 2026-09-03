# Schema Evolution

## Purpose
Evolve event schemas without breaking independently deployed producers, consumers, replays, or archived data.

## When to use
Use whenever an event field, type, semantic rule, or serialization format changes.

## Inputs
Current schemas, proposed change, compatibility mode, consumer inventory, retention horizon.

## Context to inspect
Schema registry rules, deployed consumer versions, dead-letter/replay stores, generated clients, and release cadence.

## Core knowledge
Compatibility is behavioral as well as syntactic. Additive changes are usually safer; renames are effectively remove-plus-add. Historical payloads remain part of the system for their retention lifetime.

## Procedure
1. Classify the change as additive, semantic, restrictive, or breaking.
2. Inventory active and replay consumers.
3. Test proposed schema against compatibility policy.
4. Prefer adding new fields with safe defaults.
5. For breaking semantics, introduce a new version or event type.
6. Support overlap while consumers migrate.
7. Instrument usage of deprecated versions.
8. Remove old support only after evidence shows no dependency.
9. Test replay across retained versions.
10. Record migration and rollback plans.

## Decision points
Use in-place additive evolution when semantics remain stable. Use a new major contract when meaning, cardinality, identifiers, or invariants change materially.

## Common failure patterns
Renaming fields as harmless cleanup, changing enum meanings, narrowing numeric ranges, assuming all consumers deploy together, and ignoring archived events.

## Verification
Compatibility checks pass, representative old consumers accept new events, new consumers accept retained old events, and replay tests succeed.

## Expected output
A safe evolution plan, updated schemas, migration tests, and deprecation evidence.

## Stop conditions
Stop when consumer inventory is unknown, historical data cannot be tested, or the change would silently alter business meaning.
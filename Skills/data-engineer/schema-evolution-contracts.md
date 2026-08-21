# Schema Evolution and Data Contracts

## Purpose
Evolve producer and dataset schemas without silently breaking downstream systems.

## When to use
Use when publishing shared events, tables, files, APIs, or changing fields consumed by independent teams or services.

## Inputs
Current schema, proposed change, consumer inventory, compatibility rules, ownership, and rollout constraints.

## Context to inspect
Inspect actual consumer usage, serialization formats, null/default behavior, schema registry settings, historical data, and deployment independence.

## Core knowledge
Compatibility can be backward, forward, or full and depends on reader/writer behavior. Data contracts require semantic stability as well as syntactic compatibility.

## Procedure
1. Identify producer and all known consumers.
2. Classify the proposed change as additive, restrictive, semantic, or destructive.
3. Determine required compatibility direction.
4. Prefer additive fields with safe defaults.
5. Version contracts when semantics cannot remain compatible.
6. Support dual-read or dual-write migration where necessary.
7. Validate historical records and replay behavior.
8. Communicate deprecation timelines and ownership.
9. Add automated compatibility checks to delivery pipelines.
10. Remove deprecated fields only after evidence of zero dependency.

## Decision points
Use in-place evolution for compatible additive changes; version when meaning, type, cardinality, or required behavior changes materially. Avoid versioning for every trivial addition because it increases operational surface.

## Common failure patterns
Renaming fields as if additive, changing units without versioning, making nullable fields required, assuming unused fields are truly unused, and deleting compatibility logic before consumers migrate.

## Verification
Run schema compatibility checks, test old and new readers against representative records, inspect consumer telemetry, and verify replay of historical data.

## Expected output
A migration-safe contract change with compatibility evidence, rollout plan, and deprecation policy.

## Stop conditions
Stop when consumers cannot be identified, semantic compatibility is disputed, or destructive change lacks coordinated approval.
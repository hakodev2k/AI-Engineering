# Data Minimization

## Purpose
Reduce privacy exposure by collecting, processing, exposing, and retaining only data necessary for defined purposes.

## When to use
Use when designing forms, APIs, events, telemetry, ML features, analytics, exports, and integrations.

## Inputs
Purpose statements, field definitions, consumer requirements, schemas, retention needs, and operational constraints.

## Context to inspect
Inspect actual field usage, downstream dependencies, optional attributes, duplicate stores, and debugging telemetry.

## Core knowledge
Every unnecessary field increases breach impact, access complexity, deletion scope, and governance cost. Minimization applies to precision, volume, duration, audience, and replication.

## Procedure
1. State the concrete purpose.
2. List data proposed for processing.
3. Map each field to a necessary decision or operation.
4. Remove fields without demonstrated need.
5. Reduce precision or granularity where possible.
6. Limit recipients and copies.
7. Define short retention appropriate to purpose.
8. Test behavior without removed data.
9. Document justified exceptions.

## Decision points
Choose aggregation, bucketing, tokenization, or ephemeral processing when exact raw values are unnecessary.

## Common failure patterns
Collecting “just in case,” copying full objects into events, logging payloads, and retaining raw data after aggregates suffice.

## Verification
Confirm schemas and runtime payloads exclude rejected fields and that downstream functions still meet acceptance criteria.

## Expected output
A reduced data surface with explicit necessity evidence.

## Stop conditions
Escalate when stakeholders cannot define purpose or removal conflicts with a verified obligation.
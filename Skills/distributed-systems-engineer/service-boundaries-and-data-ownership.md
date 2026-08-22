# Service Boundaries and Data Ownership

## Purpose
Define service boundaries that align ownership, invariants, deployment autonomy, and data responsibility without creating a distributed monolith.

## When to use
Use when decomposing systems, introducing services, resolving coupling, or clarifying cross-team ownership.

## Inputs
Domain model, business capabilities, change patterns, team ownership, data model, transactions, and integration flows.

## Context to inspect
Inspect shared databases, cross-module calls, release coupling, duplicated rules, ownership conflicts, and failure dependencies.

## Core knowledge
A useful service boundary owns behavior and authoritative data for a cohesive capability. Boundary quality is driven more by change and invariants than by table/entity count.

## Procedure
1. Map business capabilities and invariants.
2. Identify data and rules that change together.
3. Map team and operational ownership.
4. Detect shared-database and synchronous dependency chains.
5. Propose boundaries with explicit APIs/events.
6. Assign authoritative data ownership.
7. Define allowed duplication of derived/reference data.
8. Evaluate transaction and consistency consequences.
9. Test boundary quality against likely future changes.
10. Record migration steps and compatibility needs.

## Decision points
Keep a modular monolith when independent deployment or scaling does not justify distribution. Split services when ownership, isolation, scaling, or change autonomy provides measurable value.

## Common failure patterns
Service per entity, shared database writes, circular synchronous calls, duplicate authority, and splitting before domain boundaries are understood.

## Verification
Trace representative business changes and confirm they do not require coordinated edits across many services unnecessarily. Verify one owner per authoritative datum.

## Expected output
A boundary and ownership model with contracts, consistency implications, and migration plan.

## Stop conditions
Stop when domain ownership is disputed or required invariants cannot be assigned to a clear boundary.
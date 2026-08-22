# Data Inventory and Mapping

## Purpose
Create an evidence-based view of where personal data originates, moves, transforms, persists, and leaves organizational control.

## When to use
Use during privacy assessments, migrations, acquisitions, new integrations, incident analysis, and lifecycle-control design.

## Inputs
Schemas, APIs, event contracts, storage inventories, architecture diagrams, vendor lists, logs, and business workflows.

## Context to inspect
Inspect production paths rather than documentation alone; include backups, caches, telemetry, exports, queues, replicas, and third parties.

## Core knowledge
A useful inventory connects data category, subject, purpose, system, owner, location, recipients, retention, and protection. Static spreadsheets become stale unless tied to change processes.

## Procedure
1. Define scope and terminology.
2. Discover collection points.
3. Classify personal and sensitive fields.
4. Trace transformations and derived data.
5. Enumerate stores and transient copies.
6. Identify transfers and recipients.
7. Record purpose, owner, access, and retention.
8. Reconcile documentation with runtime evidence.
9. Flag unknown or unjustified flows.
10. Establish update ownership.

## Decision points
Use automated discovery where scale justifies it, but validate semantic meaning with system owners. Model logical flows separately from physical replicas when useful.

## Common failure patterns
Ignoring logs and backups, treating identifiers as non-personal, missing derived profiles, and trusting stale diagrams.

## Verification
Sample representative records end-to-end and confirm mapped destinations, recipients, and lifecycle rules against actual configuration.

## Expected output
A maintained data map suitable for risk analysis and control implementation.

## Stop conditions
Escalate inaccessible systems, unknown ownership, or discovered processing outside approved scope.
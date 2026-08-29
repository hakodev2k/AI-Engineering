# Data Flow and Governance

## Purpose
Design and review how customer data enters, moves through, persists in, and leaves a solution while preserving semantics and governance obligations.

## When to use
Use for data-intensive integrations, analytics, AI, migrations, and regulated workloads.

## Inputs
Data sources, schemas, classifications, retention rules, residency constraints, consumers, lineage requirements.

## Context to inspect
Collection purpose, transformations, storage locations, replication, backups, exports, deletion, access controls, and ownership.

## Core knowledge
Data architecture must address semantics, lifecycle, lineage, minimization, retention, residency, and failure recovery—not merely storage technology.

## Procedure
1. Inventory data domains and owners.
2. Classify sensitive and regulated fields.
3. Draw end-to-end data flows.
4. Document transformations and semantic contracts.
5. Define storage, retention, deletion, and residency.
6. Review access and encryption boundaries.
7. Address lineage, audit, backup, and recovery.
8. Validate governance requirements against implementation.

## Decision points
Minimize collection and replication when value does not justify governance cost. Separate authoritative and derived data deliberately.

## Common failure patterns
Unknown data copies, indefinite retention, undocumented transformations, unclear source of truth, and deletion that ignores backups or derivatives.

## Verification
Trace representative records through the lifecycle and confirm controls at each boundary.

## Expected output
A governed data-flow design with ownership and lifecycle rules.

## Stop conditions
Stop when data classification, legal constraints, or ownership cannot be established.
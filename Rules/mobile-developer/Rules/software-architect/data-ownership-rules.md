# Data Ownership Rules

## Purpose
Establish clear authority, integrity, and change control for data across modules and services.

## Scope
Applies to databases, schemas, aggregates, shared data, replication, reporting stores, and data contracts.

## MUST
- Every authoritative data set MUST have a clear owning boundary.
- Cross-boundary access MUST use an explicit contract or approved integration path.
- Replicated data MUST define source of truth, freshness expectations, and reconciliation behavior.
- Data model changes MUST assess compatibility, migration, and operational impact.

## MUST NOT
- MUST NOT let multiple services independently mutate the same authoritative records without an explicit consistency design.
- MUST NOT use direct database access across ownership boundaries as an undocumented integration shortcut.
- MUST NOT duplicate sensitive data without justified need and lifecycle controls.

## SHOULD
- Prefer local ownership with explicit synchronization over uncontrolled shared databases.
- Prefer immutable event or audit evidence for important cross-boundary state transitions where appropriate.

## Exceptions
Shared storage may be acceptable for tightly coupled modules when ownership and mutation rules remain explicit.

## Verification
Review schema ownership, database permissions, data-flow diagrams, integration tests, migration plans, and reconciliation telemetry.
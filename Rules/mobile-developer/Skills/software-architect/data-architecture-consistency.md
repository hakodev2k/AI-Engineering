# Data Architecture and Consistency

## Purpose
Design data ownership, persistence boundaries, consistency models, and integration patterns that support business invariants without unnecessary coupling.

## When to use
Use when defining databases, splitting data ownership, integrating services, handling replicated data, or resolving inconsistent state.

## Inputs
Domain model, data schema, workflows, invariants, read/write patterns, retention rules, compliance requirements, scaling needs.

## Context to inspect
Current databases, shared tables, replication, caches, ETL, message flows, transaction scopes, data lifecycle, and recovery procedures.

## Core knowledge
Data ownership should align with bounded responsibilities. Strong consistency has coordination cost; eventual consistency requires explicit reconciliation and user-visible semantics. Read models may differ from write models when justified.

## Procedure
1. Identify authoritative owners for each business datum.
2. Map invariants and required consistency boundaries.
3. Choose storage models based on access patterns and constraints.
4. Define transaction scopes.
5. Define cross-boundary synchronization and reconciliation.
6. Design read replicas/caches with staleness expectations.
7. Define schema evolution, retention, backup, and restore.
8. Document privacy and access controls.
9. Test failure and recovery scenarios.

## Decision points
Use strong consistency for hard business invariants; eventual consistency where temporary divergence is acceptable. Prefer a single source of truth over uncontrolled multi-master ownership.

## Common failure patterns
Shared databases across independent services, unclear source of truth, cache treated as authoritative, unbounded denormalization, no reconciliation, and schema changes without compatibility planning.

## Verification
Trace critical workflows from write to read, validate invariants, simulate stale/duplicate data, and test restore/reconciliation paths.

## Expected output
A data ownership and consistency design with explicit lifecycle, synchronization, and recovery semantics.

## Stop conditions
Stop when legal, retention, ownership, or consistency requirements are unresolved.
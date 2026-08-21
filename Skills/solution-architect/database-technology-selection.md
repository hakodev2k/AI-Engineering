# Database Technology Selection

## Purpose
Select database technologies from workload requirements rather than product familiarity or trend.

## When to use
Use when choosing relational, document, key-value, graph, time-series, search, or analytical stores.

## Inputs
Query patterns, transaction needs, consistency, scale, data shape, latency, availability, operations, budget.

## Preconditions
Access patterns and data criticality are understood.

## Context to inspect
Expected read/write ratios, indexes, joins, transaction scope, partitioning, growth, backup/restore, managed-service options, team expertise.

## Core knowledge
Every database trades capabilities. Relational systems excel at transactions and flexible relational querying; specialized stores can outperform for specific access patterns but increase operational and cognitive load.

## Procedure
1. Enumerate required read/write/query patterns.
2. Define consistency and transaction guarantees.
3. Estimate data volume and growth.
4. Define latency and availability requirements.
5. Compare candidate technologies against mandatory requirements.
6. Evaluate indexing and partitioning strategy.
7. Assess backup, restore, replication, and failover.
8. Assess operational maturity and managed-service support.
9. Estimate total cost, including people and migration.
10. Prototype only the uncertain/high-risk characteristics.

## Decision points
Prefer mature general-purpose stores when requirements fit. Introduce specialized databases when measurable workload benefits exceed added complexity.

## Common failure patterns
Polyglot persistence by default, ignoring restore capability, choosing from benchmarks unrelated to workload, underestimating operational burden.

## Verification
Representative load and failure scenarios validate mandatory guarantees.

## Expected output
Technology decision with workload evidence and operational consequences.

## Stop conditions
Stop when data guarantees cannot be stated clearly.
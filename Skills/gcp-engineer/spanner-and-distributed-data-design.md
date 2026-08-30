# Spanner and Distributed Data Design

## Purpose
Design globally or regionally distributed relational workloads on Cloud Spanner with sound schema, key, transaction, and capacity choices.

## When to use
Use when strong consistency, horizontal scale, high availability, or multi-region relational access exceeds conventional database patterns.

## Inputs
Transaction model, key access patterns, write rate, read locality, data volume, consistency needs, availability targets, and regional topology.

## Context to inspect
Schema, primary keys, interleaving decisions, indexes, query plans, transaction size, hotspots, instance configuration, and processing units/nodes.

## Core knowledge
Spanner scales through key-range distribution; monotonically increasing leading keys can create hotspots. Secondary indexes and multi-region replicas add performance and cost trade-offs.

## Procedure
1. Confirm Spanner is justified by scale or availability requirements.
2. Model entities and transaction boundaries.
3. Design primary keys for distribution and locality.
4. Create only necessary secondary indexes.
5. Bound read-write transactions.
6. Choose regional or multi-region configuration.
7. Estimate capacity from measured load.
8. Load test hot-key and failure scenarios.
9. Inspect query plans and lock behavior.
10. Define backup and change-management procedures.

## Decision points
Use regional configurations when global placement is unnecessary. Prefer stale/bounded reads only when business semantics allow them.

## Common failure patterns
Sequential hot keys, oversized transactions, excessive indexes, porting single-node schemas unchanged, and underestimating multi-region latency.

## Verification
Run representative load, inspect key distribution, transaction aborts, query plans, and failover behavior.

## Expected output
A scalable Spanner data model and capacity plan.

## Stop conditions
Stop when transaction semantics cannot be expressed safely or cost is unjustified versus managed relational alternatives.
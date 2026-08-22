# Consistency Models

## Purpose
Choose and enforce a consistency model that matches business invariants, latency goals, availability needs, and replication behavior.

## When to use
Use for replicated data, caches, distributed databases, multi-region systems, asynchronous projections, and cross-service workflows.

## Inputs
Business invariants, read/write patterns, topology, storage guarantees, latency targets, and failure assumptions.

## Context to inspect
Inspect transaction boundaries, replication mode, read routing, caches, event propagation, conflict handling, and user-visible expectations.

## Core knowledge
Strong consistency simplifies reasoning but can increase coordination and reduce availability under partition. Eventual consistency improves decoupling and availability but requires explicit handling of stale reads, conflicts, and convergence.

## Procedure
1. Identify invariants that must never be violated.
2. Separate correctness requirements from freshness preferences.
3. Determine where coordination is technically required.
4. Map available consistency guarantees from storage and messaging systems.
5. Select guarantees per operation rather than globally.
6. Design conflict detection, reconciliation, and user-visible states where convergence is asynchronous.
7. Document read-after-write and monotonic-read expectations.
8. Test stale, concurrent, and partitioned scenarios.

## Decision points
Use stronger coordination for scarce resources, money, permissions, or irreversible transitions when invariants require it. Prefer eventual consistency for derived views and workflows where temporary divergence is acceptable.

## Common failure patterns
Calling a system eventually consistent without defining convergence, assuming cache invalidation is immediate, mixing authoritative and derived state, and hiding stale-state semantics from consumers.

## Verification
Prove invariants under concurrent writes and delayed propagation. Measure convergence time and validate client behavior during stale reads.

## Expected output
An explicit consistency contract and implementation strategy for each important data flow.

## Stop conditions
Stop when required guarantees exceed platform capabilities or when the business cannot define acceptable divergence.
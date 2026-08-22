# Retention and Deletion Engineering

## Purpose
Translate retention decisions into reliable deletion across primary, derived, replicated, and recoverable data stores.

## When to use
Use when designing lifecycle controls, decommissioning features, implementing account deletion, or reducing legacy data.

## Inputs
Retention policy, data map, storage topology, backup strategy, dependencies, legal holds, and recovery requirements.

## Context to inspect
Inspect databases, object stores, indexes, caches, logs, queues, analytics stores, backups, and third-party processors.

## Core knowledge
Deletion is a distributed workflow. Hard deletion, logical deletion, cryptographic erasure, and expiry have different semantics. Recovery systems need bounded reappearance controls.

## Procedure
1. Map each data class to retention rule.
2. Identify authoritative and derived copies.
3. Define deletion triggers and exceptions.
4. Design idempotent deletion propagation.
5. Handle indexes, caches, and asynchronous replicas.
6. Define backup expiry or restoration safeguards.
7. Record evidence without retaining deleted payloads.
8. Test partial failures and retries.
9. Monitor deletion latency and failures.

## Decision points
Use hard deletion when feasible; use cryptographic erasure or bounded backup expiry where physical deletion is impractical and approved.

## Common failure patterns
Deleting only primary rows, orphaned blobs, restored deleted records, infinite tombstones, and unbounded retries.

## Verification
Create traceable test subjects and prove all in-scope copies become inaccessible within the required window.

## Expected output
A resilient, auditable lifecycle deletion mechanism.

## Stop conditions
Escalate legal holds, conflicting retention duties, destructive uncertainty, or inaccessible processors.
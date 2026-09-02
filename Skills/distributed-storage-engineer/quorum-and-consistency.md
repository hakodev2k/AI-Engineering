# Quorum and Consistency

## Purpose
Define and validate read/write quorum behavior and client-visible consistency guarantees for replicated storage.

## When to use
Use when selecting quorum sizes, tuning consistency, diagnosing stale or conflicting reads, or changing replication semantics.

## Inputs
Replica count, read/write paths, consistency requirements, latency targets, conflict model, failure assumptions, and client retry behavior.

## Preconditions
Separate required application semantics from implementation preferences such as leader-based or leaderless replication.

## Context to inspect
Read and write acknowledgement logic, replica health rules, read repair, hinted handoff, versioning, clocks, conflict resolution, and failover behavior.

## Core knowledge
Quorum arithmetic alone does not guarantee correctness when membership, failures, sloppy quorums, stale replicas, clocks, or write races violate assumptions. Linearizability, sequential consistency, causal consistency, eventual consistency, and session guarantees provide materially different semantics.

## Procedure
1. Translate business invariants into explicit consistency requirements.
2. Document replica membership and acknowledgement semantics.
3. Derive read/write quorum intersections under normal membership.
4. Analyze membership changes and degraded modes.
5. Define concurrent-write conflict detection and resolution.
6. Define read repair and anti-entropy behavior.
7. Evaluate clock dependence and ordering assumptions.
8. Specify client retry and idempotency expectations.
9. Model stale, unavailable, and partitioned replicas.
10. Test properties with concurrent histories.
11. Document guarantees and cases where they weaken.

## Decision points
Use stronger consistency where stale or conflicting state violates correctness. Prefer weaker consistency where availability and latency matter more and conflicts are safely reconcilable.

## Common failure patterns
Assuming R+W>N is sufficient in all topologies, mixing membership epochs, last-write-wins with unreliable clocks, undocumented degraded consistency, retry-created duplicate writes, and read repair that cannot converge conflicting states.

## Verification
Run consistency tests under concurrent operations, delayed replicas, membership changes, and failovers. Check observed histories against the stated model rather than only checking eventual convergence.

## Expected output
A documented consistency model, quorum policy, conflict behavior, degraded-mode semantics, and verification evidence.

## Stop conditions
Stop when application correctness depends on semantics that the underlying replication design cannot provide.
# Repair and Anti-Entropy

## Purpose
Design and operate background repair mechanisms that detect and reconcile replica divergence before redundancy silently decays.

## When to use
Use when replicas can diverge through failures, asynchronous replication, missed updates, corruption detection, or long-lived node outages.

## Inputs
Replica topology, version metadata, checksums, repair backlog, bandwidth limits, consistency model, tombstone rules, and failure history.

## Preconditions
Define authoritative comparison semantics and conflict-resolution rules before automated repair.

## Context to inspect
Merkle trees or checksums, replica versioning, read repair, scheduled scans, repair queues, tombstones, compaction, throttling, and alert thresholds.

## Core knowledge
Repair is a continuous reliability mechanism, not an occasional maintenance task. Full scans are expensive; hierarchical hashes can narrow differences. Repair must not resurrect deleted data, overwrite newer versions, or saturate disks and networks. Repair age is often a better risk signal than queue length alone.

## Procedure
1. Define what constitutes replica divergence.
2. Select comparison metadata and scan granularity.
3. Establish repair cadence based on durability risk and retention rules.
4. Detect differences without trusting a single replica blindly.
5. Resolve version ordering or conflicts according to storage semantics.
6. Protect deletion markers and expiration semantics.
7. Prioritize under-replicated or high-value data.
8. Throttle repair against foreground workload and recovery reserve.
9. Make repair operations resumable and idempotent.
10. Track repair age, bytes pending, errors, and completion rate.
11. Validate repaired replicas before closing work.
12. Investigate recurring divergence as a production defect.

## Decision points
Use opportunistic read repair for frequently read data, scheduled anti-entropy for comprehensive coverage, and targeted repair after known outages. Combine mechanisms when their failure coverage is complementary.

## Common failure patterns
Repair storms, stale replicas overwriting fresh data, tombstone resurrection, scans that never complete, ignoring cold data, and masking a persistent replication defect with endless repair.

## Verification
Introduce controlled replica differences in test environments, verify detection and convergence, measure repair completion time, and confirm foreground SLOs remain protected.

## Expected output
A repair strategy with comparison method, scheduling, prioritization, conflict rules, throttling, observability, and escalation criteria.

## Stop conditions
Stop automated repair when ordering is ambiguous, suspected corruption affects multiple replicas, or repair would violate deletion or retention guarantees.
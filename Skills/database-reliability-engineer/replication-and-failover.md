# Replication and Failover

## Purpose
Operate replication and failover safely while controlling lag, consistency, and data-loss risk.

## When to use
Use when configuring replicas, investigating lag, preparing maintenance, or executing failover.

## Inputs
Replication topology, consistency needs, lag metrics, write volume, network conditions, and recovery objectives.

## Context to inspect
Replication mode, slots/log retention, replica health, quorum, client routing, promotion tooling, and monitoring.

## Core knowledge
Replication trades latency, availability, and consistency. Failover can create divergent histories or data loss if promotion safety is weak.

## Procedure
1. Map replication relationships and modes.
2. Establish healthy lag baselines.
3. Monitor transport, apply, and replay lag separately where available.
4. Identify bottlenecks causing lag.
5. Verify candidate replica freshness before promotion.
6. Fence the old primary when required.
7. Promote through controlled automation.
8. Redirect clients and validate writes.
9. Rebuild or rejoin former nodes safely.
10. Confirm topology and alerts after recovery.

## Decision points
Prefer automatic failover only when fencing and health signals are trustworthy. Use manual approval when ambiguity could cause split brain or unacceptable loss.

## Common failure patterns
Promoting stale replicas, no fencing, hidden replication lag, exhausted log storage, and assuming read replicas are transactionally current.

## Verification
Demonstrate controlled promotion, expected RPO, client recovery, no divergent writers, and restored redundancy.

## Expected output
A reliable replication topology and tested failover procedure with measurable safety gates.

## Stop conditions
Stop if replica freshness is unknown, fencing cannot be guaranteed, or promotion exceeds approved data-loss tolerance.
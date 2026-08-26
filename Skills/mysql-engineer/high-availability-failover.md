# High Availability and Failover

## Purpose
Engineer predictable MySQL availability and failover aligned with explicit RPO/RTO objectives.

## When to use
Use for HA design, failover automation, maintenance planning, or resilience reviews.

## Inputs
RPO/RTO, topology, failure modes, routing layer, replication guarantees, operational ownership.

## Context to inspect
Failure detection, quorum/fencing, DNS/proxy behavior, replica eligibility, backups, cross-zone/region placement, client retry semantics.

## Core knowledge
Failover is a distributed-systems problem: split brain, stale promotion, lost writes, and client reconnection are central risks. Availability claims require drills.

## Procedure
1. Define tolerated failures and recovery objectives.
2. Enumerate node, zone, region, network, storage, and operator failures.
3. Define authoritative promotion criteria and fencing.
4. Select candidate replicas using durability and freshness signals.
5. Design traffic redirection and connection-pool recovery.
6. Define handling of uncertain/duplicate writes.
7. Automate health checks conservatively.
8. Drill planned switchover and unplanned failover.
9. Validate data and rebuild old primary safely.
10. Record measured RTO/RPO and gaps.

## Decision points
Automate promotion only when fencing and correctness are reliable. Prefer controlled manual decisions for ambiguous partition states if automation could create split brain.

## Common failure patterns
Promoting the fastest responder rather than safest replica, no fencing, DNS TTL surprises, retry storms, and never testing full application recovery.

## Verification
Run failure drills, confirm single-writer property, measure recovery time and data loss window, and validate client behavior.

## Expected output
HA architecture plus tested failover, switchover, and rejoin procedures.

## Stop conditions
Stop if authoritative writer cannot be determined, fencing is unavailable, or promotion exceeds accepted data-loss risk.
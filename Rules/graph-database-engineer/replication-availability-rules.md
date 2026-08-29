# Replication and Availability Rules

## Purpose
Maintain graph service continuity without hiding consistency or failover risks.

## Scope
Replication, clustering, quorum, read replicas, failover, and topology changes.

## MUST
- Document consistency and durability guarantees for each read/write path.
- Size quorum and failure domains to tolerate the agreed failures.
- Test failover and client reconnection behavior before relying on it operationally.
- Monitor replication lag, unavailable members, leader changes, and write durability indicators.
- Require approval for production topology changes with material availability risk.

## MUST NOT
- Route consistency-sensitive reads to lagging replicas without an explicit stale-read contract.
- Count replicas in the same failure domain as independent resilience.
- Assume automatic failover eliminates application retry and idempotency concerns.

## SHOULD
- Distribute replicas across independent failure domains appropriate to the threat model.
- Exercise degraded-mode operations regularly.

## Exceptions
Single-instance production use requires explicit risk acceptance, recovery objectives, backup evidence, and documented outage impact.

## Verification
Inspect topology, quorum configuration, failure-domain placement, replication metrics, chaos/failover tests, client behavior, and measured recovery time.
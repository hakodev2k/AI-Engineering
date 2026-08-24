# Distributed Search

## Purpose
Maintain predictable correctness and availability across shards, replicas, nodes, and regions.

## Scope
Sharding, replication, routing, consistency, fan-out, rebalancing, and failure recovery.

## MUST
- Define shard key and routing strategy using measured corpus, traffic, and growth characteristics.
- Detect and mitigate hot shards and skew.
- Define acceptable read freshness and consistency semantics for indexed updates.
- Test node, shard, and zone failure behavior before relying on redundancy claims.

## MUST NOT
- Assume replica count alone proves availability.
- Rebalance or reshard production data without capacity, rollback, and failure analysis.
- Let unbounded query fan-out become the default architecture.

## SHOULD
- Design routing to limit blast radius and unnecessary cross-node work.
- Maintain capacity headroom for recovery operations.

## Exceptions
Exceptions require quantified availability/cost trade-offs and approval for elevated production risk.

## Verification
Review shard distributions, recovery tests, failure injection, routing traces, capacity metrics, and freshness measurements.
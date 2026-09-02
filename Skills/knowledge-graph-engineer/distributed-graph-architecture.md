# Distributed Graph Architecture

## Purpose
Design graph platforms that scale across machines, regions, or services while preserving acceptable consistency, traversal latency, availability, and operational simplicity.

## When to use
Use when a graph exceeds single-node capacity, requires high availability, serves geographically distributed users, or must isolate workloads and domains.

## Inputs
Data volume, growth rate, traversal patterns, write rate, consistency needs, availability targets, geography, recovery objectives, and engine capabilities.

## Preconditions
Establish measured bottlenecks and confirm that distribution is needed; do not shard merely because the graph is strategically important.

## Context to inspect
Degree distribution, hot nodes, cross-partition traversals, replication topology, transaction boundaries, storage engine, caches, network latency, and failure history.

## Core knowledge
Graph partitioning is harder than tabular sharding because traversals cross ownership boundaries. Partitioning should minimize common cross-shard edges while respecting identity and write locality. Replication improves availability and read locality but introduces consistency and operational trade-offs.

## Procedure
1. Capture current workload and growth projections.
2. Identify hot entities and dominant traversal communities.
3. Define consistency requirements by operation.
4. Evaluate vertical scaling before distribution.
5. Choose partition keys or community-aware partitioning based on access locality.
6. Quantify expected cross-partition traversals.
7. Design replication and failover behavior.
8. Define transaction limits across partitions.
9. Separate analytical and transactional workloads where useful.
10. Model network partitions, node loss, and rebalancing.
11. Load-test realistic graph topology, not uniform synthetic data.
12. Define observability for partition skew, replication lag, and remote traversal cost.
13. Document recovery and capacity procedures.

## Decision points
Prefer a single logical graph when operational simplicity and strong traversal locality dominate. Federate graphs when domains have distinct ownership or security boundaries. Use read replicas for locality only when staleness is acceptable.

## Common failure patterns
Hash partitioning without topology analysis; cross-shard transactions everywhere; hidden hot supernodes; assuming replicas are immediately consistent; and testing with unrealistic degree distributions.

## Verification
Run scale tests, failure injection, replica-lag tests, rebalancing drills, and representative cross-partition queries. Confirm SLOs and recovery objectives.

## Expected output
A distributed graph topology, partition/replication strategy, consistency model, capacity plan, and failure runbooks.

## Stop conditions
Stop when distribution would violate required transaction semantics or the selected platform cannot support the required recovery/consistency guarantees.
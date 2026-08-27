# Storage Architecture and Requirements

## Purpose
Translate workload and business requirements into a defensible storage architecture with explicit durability, availability, latency, capacity, compliance, and cost targets.

## When to use
Use for new platforms, major workload changes, migrations, capacity expansions, or architecture reviews. Do not select products before requirements are measurable.

## Inputs
Workload profile, data classes, growth forecast, SLOs, RPO/RTO, access patterns, retention, compliance constraints, budget, infrastructure topology.

## Context to inspect
Existing storage tiers, network paths, failure domains, backup design, client protocols, operational ownership, monitoring, and historical incidents.

## Core knowledge
Storage design is a trade-off among latency, throughput, IOPS, durability, availability, consistency, operability, and cost. Peak and tail behavior matter more than averages. Failure domains and recovery objectives must shape topology.

## Procedure
1. Classify data by criticality and lifecycle.
2. Quantify capacity, growth, IOPS, throughput, block/object sizes, concurrency, and read/write ratio.
3. Define latency percentiles and availability/durability targets.
4. Establish RPO/RTO and retention requirements.
5. Map workloads to block, file, object, or specialized storage.
6. Identify failure domains and required redundancy.
7. Model network and replication overhead.
8. Compare candidate architectures using measurable criteria.
9. Define scaling, backup, observability, security, and lifecycle operations.
10. Record assumptions, risks, and an architecture decision.

## Decision points
Prefer simpler managed storage when it meets requirements; choose specialized or self-managed systems only when control, performance, economics, or compliance justify operational burden. Scale up for bounded simplicity; scale out for growth and fault-domain distribution.

## Common failure patterns
Sizing from averages, ignoring tail latency, treating backup as HA, hidden cross-zone costs, single control-plane dependencies, untested recovery, and product-first design.

## Verification
Validate assumptions with representative load tests, failure simulations, cost models, recovery tests, and SLO instrumentation. Implementation is not verification until measured behavior meets targets.

## Expected output
A requirements matrix, architecture, sizing model, failure-domain map, operational plan, risks, and decision record.

## Stop conditions
Escalate when critical SLOs, data classification, RPO/RTO, compliance obligations, or ownership are unresolved.
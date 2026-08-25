# Messaging Platform Architecture

## Purpose
Design a production-grade messaging platform that supports multiple workloads without coupling teams to one broker implementation. This Skill helps a Senior Messaging Platform Engineer define service boundaries, broker topology, ownership, SLOs, and operational controls.

## When to use
Use when establishing or redesigning a shared Kafka, RabbitMQ, Pulsar, NATS, cloud queue, or hybrid messaging platform. Do not use as a substitute for application-level event modeling.

## Inputs
- Workload inventory and traffic characteristics
- Availability and durability requirements
- Security and compliance constraints
- Regional topology
- Existing brokers and client libraries
- Cost and operational constraints

## Context to inspect
Inspect current broker clusters, tenants, namespaces/topics/queues, client patterns, deployment topology, failure history, operational ownership, and platform SLOs.

## Core knowledge
A Senior engineer should understand broker clustering, replication, partitioning, leader election, queue and log semantics, control-plane versus data-plane separation, multi-tenancy, failure domains, backpressure, client behavior, and the trade-offs among self-managed and managed services.

## Procedure
1. Classify workloads by latency, throughput, durability, ordering, replay, and fan-out requirements.
2. Separate workloads that have incompatible guarantees or blast-radius requirements.
3. Choose platform technologies based on workload fit rather than standardizing prematurely.
4. Define cluster, namespace, tenant, topic, and queue boundaries.
5. Map failure domains across zones and regions.
6. Define replication, quorum, and durability settings.
7. Establish client connectivity, authentication, authorization, and network boundaries.
8. Define quotas and protection mechanisms for noisy-neighbor control.
9. Establish SLOs, capacity headroom, maintenance windows, and escalation ownership.
10. Document supported patterns, unsupported patterns, and migration paths.

## Decision points
Use a distributed log when replay, ordered partitions, and high-throughput streaming dominate. Use queues when task distribution and competing consumers dominate. Prefer managed platforms when reduced operational burden outweighs feature or cost constraints.

## Common failure patterns
- One cluster for every workload regardless of blast radius
- No tenancy or quota strategy
- Cross-region designs that ignore latency and egress cost
- Treating broker defaults as production architecture
- Platform ownership without application integration standards

## Verification
Review failure-domain diagrams, run dependency and capacity checks, validate broker behavior during node loss, confirm security boundaries, and test representative workloads under expected peak conditions.

## Expected output
An architecture decision with topology, workload placement, guarantees, SLOs, ownership, constraints, and migration considerations.

## Stop conditions
Stop when business continuity requirements are undefined, required guarantees conflict with the chosen broker, or a design depends on unsupported platform capabilities.
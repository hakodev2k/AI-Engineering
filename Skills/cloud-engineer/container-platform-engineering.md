# Container Platform Engineering

## Purpose
Design and operate container platforms with predictable scheduling, networking, security, scaling, and upgrades.

## When to use
Use for Kubernetes or managed container platforms supporting multiple production workloads.

## Inputs
Workload profiles, availability targets, traffic patterns, security constraints, cluster topology, deployment model.

## Context to inspect
Clusters, node pools, namespaces, admission controls, ingress, service networking, storage, autoscaling, quotas, observability.

## Core knowledge
Containers package processes; orchestration adds distributed-system concerns. Resource requests, health signals, disruption policies, and workload identity directly affect reliability.

## Procedure
1. Classify workloads and isolation needs.
2. Define cluster and namespace boundaries.
3. Set resource requests, limits, quotas, and scheduling rules.
4. Configure workload identity and secret delivery.
5. Design ingress, service discovery, and network policies.
6. Define readiness, liveness, startup, and graceful shutdown behavior.
7. Configure autoscaling and disruption controls.
8. Establish upgrade and node replacement procedures.
9. Centralize logs, metrics, and events.
10. Run failure and capacity tests.

## Decision points
Use separate clusters when regulatory, blast-radius, lifecycle, or hard isolation needs outweigh platform overhead.

## Common failure patterns
Missing requests, privileged containers, mutable tags, weak probes, cluster-wide permissions, and upgrades never rehearsed.

## Verification
Test rollout, rollback, node loss, autoscaling, policy enforcement, and workload recovery.

## Expected output
A supportable container platform with documented workload contracts.

## Stop conditions
Escalate unsupported workloads, unresolved privilege requirements, or capacity that cannot meet resilience targets.
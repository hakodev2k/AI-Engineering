# Kubernetes Operations

## Purpose
Deploy, operate, and troubleshoot Kubernetes workloads with controlled reliability and blast radius.

## When to use
Use for cluster workloads, deployments, services, ingress, autoscaling, scheduling, upgrades, or incidents.

## Inputs
Manifests/Helm/Kustomize, cluster version, namespaces, workload SLOs, resource usage, network and storage needs.

## Context to inspect
Events, pod status, probes, resource requests/limits, HPA, PDB, service endpoints, ingress, network policies, storage classes, node health.

## Core knowledge
Kubernetes reconciles desired state but does not guarantee application correctness. Availability depends on scheduling, probes, disruption budgets, rollout strategy, capacity, network, storage, and application behavior.

## Procedure
1. Inspect desired manifests and current objects.
2. Check events before logs.
3. Validate probes and rollout status.
4. Check scheduling/resource pressure.
5. Validate service endpoints and network policy.
6. Inspect storage dependencies.
7. Review HPA and capacity headroom.
8. Test rollout and rollback.
9. Check PDB/anti-affinity for failure domains.
10. Capture evidence before disruptive changes.

## Decision points
Use Deployments for stateless workloads, StatefulSets for stable identity/storage; prefer managed controllers before custom operators; tune autoscaling from workload metrics.

## Common failure patterns
Incorrect probes, no requests, aggressive limits, single-replica critical services, mutable tags, blanket cluster-admin, manual kubectl drift.

## Verification
Rollout is healthy, replicas spread as intended, service routing works, autoscaling/probes behave, rollback succeeds.

## Expected output
Operationally safe workload configuration and reproducible troubleshooting evidence.

## Stop conditions
Stop before cluster-wide or control-plane changes without recovery and maintenance approval.
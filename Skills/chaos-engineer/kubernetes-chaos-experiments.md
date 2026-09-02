# Kubernetes Chaos Experiments

## Purpose
Validate workload resilience against Kubernetes-specific disruptions while distinguishing application behavior from scheduler, node, storage, and control-plane behavior.

## When to use
Use for Kubernetes-hosted systems that depend on replica scheduling, readiness, autoscaling, disruption budgets, persistent volumes, or multi-zone placement.

## Inputs
Manifests, Helm or Kustomize configuration, topology, replica counts, PodDisruptionBudgets, probes, autoscaling rules, resource requests and limits, storage classes, and SLOs.

## Preconditions
Cluster health is stable, namespace and target selectors are precise, rollback is tested, and control-plane access remains outside the experiment scope unless explicitly approved.

## Context to inspect
Deployments, StatefulSets, DaemonSets, services, ingress, readiness and liveness probes, affinity rules, topology spread, node pools, PVCs, HPA/VPA, and eviction policies.

## Core knowledge
Pod deletion alone is not sufficient Kubernetes resilience testing. Senior experiments examine scheduling delays, zone concentration, node unavailability, probe behavior, disruption budgets, storage attachment, and autoscaling. Kubernetes can restore desired resource state while the application remains unavailable or inconsistent.

## Procedure
1. Identify the workload capability and expected redundancy.
2. Inspect placement and disruption constraints.
3. Establish baseline pod, node, traffic, and user metrics.
4. Select one Kubernetes failure mechanism.
5. Scope targets with explicit labels and namespaces.
6. Execute within defined safety guardrails.
7. Observe scheduling, readiness, routing, storage, and autoscaling behavior.
8. Validate user steady state and data correctness.
9. Restore the target condition if automatic reconciliation is insufficient.
10. Confirm the workload returns to balanced healthy placement.

## Decision points
Use pod disruption for process resilience, node disruption for placement and capacity assumptions, and zone-scoped experiments for failure-domain validation. Avoid control-plane experiments unless the platform team owns the risk and observability.

## Common failure patterns
All replicas sharing one zone; misleading readiness probes; PDBs that block maintenance or fail to protect availability; slow image pulls; storage reattachment delays; and autoscaling that lacks spare cluster capacity.

## Verification
Confirm Kubernetes reconciliation occurred as expected and separately verify user outcomes, recovery time, and post-recovery placement.

## Expected output
Evidence of workload and platform resilience, discovered topology gaps, and remediation actions.

## Stop conditions
Stop if selectors are ambiguous, cluster-wide impact cannot be bounded, or critical platform health is already degraded.
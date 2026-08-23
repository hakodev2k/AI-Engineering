# AKS Platform Engineering

## Purpose
Design and operate Azure Kubernetes Service clusters with secure identity, networking, scaling, upgrades, and workload isolation.

## When to use
Use when AKS is the chosen workload platform, during cluster design, upgrades, capacity incidents, or platform hardening.

## Inputs
Workload classes, node requirements, traffic, availability targets, network model, identity needs, deployment model, and operational maturity.

## Context to inspect
Inspect cluster version, node pools, CNI/network ranges, workload identity, ingress, autoscaling, policies, secrets, persistent volumes, upgrade settings, observability, and quotas.

## Core knowledge
AKS reduces control-plane management but not Kubernetes operational responsibility. Node pools, pod requests/limits, disruption budgets, autoscaling, network design, and upgrade discipline determine production reliability.

## Procedure
1. Confirm Kubernetes is justified by workload and team needs.
2. Define cluster and node-pool isolation boundaries.
3. Plan pod/service/VNet address capacity.
4. Configure Entra integration and workload identity.
5. Establish ingress/egress and network-security controls.
6. Require resource requests/limits and autoscaling policy.
7. Define storage classes and stateful-workload constraints.
8. Configure monitoring, logs, policy, and image security.
9. Establish tested node-image and Kubernetes-version upgrade procedures.
10. Run failure, drain, scale, and upgrade tests before production rollout.

## Decision points
Use separate clusters when regulatory, blast-radius, or lifecycle isolation outweighs shared-platform efficiency. Use multiple node pools for materially different workload, hardware, or isolation requirements.

## Common failure patterns
Kubernetes without operational ownership, exhausted IP space, no resource requests, privileged workloads by default, unmanaged upgrades, single node pool for everything, and relying on cluster autoscaler to fix bad scheduling design.

## Verification
Validate workload identity, policy enforcement, node drain behavior, autoscaling, ingress failover, pod disruption handling, and a representative cluster upgrade.

## Expected output
A governed AKS platform with documented capacity, identity, networking, security, upgrade, and recovery procedures.

## Stop conditions
Stop when the team cannot own Kubernetes operations, IP capacity is insufficient, or required upgrades cannot be rehearsed safely.
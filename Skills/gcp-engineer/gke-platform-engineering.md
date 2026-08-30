# GKE Platform Engineering

## Purpose
Operate Google Kubernetes Engine as a reliable, secure application platform with appropriate cluster topology, node strategy, identity, networking, upgrades, and workload controls.

## When to use
Use for GKE design, modernization, scaling, security review, or recurring cluster instability.

## Inputs
Workload classes, availability targets, regions, security model, node requirements, deployment patterns, and cost constraints.

## Context to inspect
Cluster mode, release channel, node pools, autoscaling, Workload Identity, network policy, ingress/gateway, PodDisruptionBudgets, quotas, and observability.

## Core knowledge
GKE Standard offers control flexibility; Autopilot reduces node operations. Regional clusters improve control-plane resilience. Workload Identity should replace node-level credential dependence.

## Procedure
1. Classify workloads and isolation needs.
2. Choose Autopilot or Standard.
3. Select regional/zonal topology.
4. Define node pools, taints, autoscaling, and machine families.
5. Configure Workload Identity and RBAC.
6. Apply network policies and secure pod defaults.
7. Design ingress and service exposure.
8. Establish upgrade and disruption budgets.
9. Configure logging, metrics, and SLOs.
10. Validate failure and scaling scenarios.

## Decision points
Prefer Autopilot for general workloads when node-level customization is unnecessary. Use dedicated pools for hardware, isolation, or scheduling constraints.

## Common failure patterns
Privileged pods, broad node service accounts, no resource requests, upgrade deadlocks, and single-zone stateful dependencies.

## Verification
Run conformance checks, scale tests, upgrade rehearsal, IAM tests, and simulated node failure.

## Expected output
A production-ready GKE platform configuration.

## Stop conditions
Stop for unsupported kernel/runtime requirements or unresolved stateful-data architecture.
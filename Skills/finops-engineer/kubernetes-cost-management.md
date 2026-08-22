# Kubernetes Cost Management

## Purpose
Attribute and optimize Kubernetes cost across clusters, namespaces, workloads, and teams while accounting for shared capacity and scheduling efficiency.

## When to use
Use when container platforms represent material spend or namespace-level cloud bills do not explain workload economics.

## Inputs
Cluster/node billing, workload requests and usage, namespace metadata, autoscaler data, storage/network charges, shared platform services.

## Context to inspect
Inspect requests versus actual usage, node pools, bin packing, idle capacity, daemonsets, system namespaces, autoscaling, persistent volumes, accelerators, and multi-tenancy.

## Core knowledge
Kubernetes allocation is capacity-based as well as usage-based. Requests influence schedulable capacity; idle cluster cost must remain visible. Optimization spans workload requests, node shapes, autoscaling, scheduling, and platform architecture.

## Procedure
1. Reconcile cluster infrastructure cost to cloud billing.
2. Define workload ownership and allocation boundaries.
3. Allocate node capacity using requests/usage with an explicit idle-cost policy.
4. Include storage, network, accelerators, and shared services.
5. Identify request-to-usage gaps and stranded node capacity.
6. Analyze node-pool shape and bin-packing constraints.
7. Review HPA/VPA/cluster autoscaler behavior.
8. Prioritize changes by savings and reliability risk.
9. Implement incrementally with workload owners.
10. Verify realized cluster and unit-cost improvements.

## Decision points
Use requests for capacity responsibility, usage for consumption insight, or a blended model according to accountability goals. Keep platform overhead separately visible when useful.

## Common failure patterns
Allocating only CPU usage, hiding idle cost, reducing requests without understanding OOM/throttling risk, ignoring persistent storage, and optimizing nodes while workload requests remain inflated.

## Verification
Allocated totals reconcile to cluster cost; scheduling and SLO metrics remain healthy; node utilization/bin packing improves; billing confirms savings.

## Expected output
Workload cost allocation, idle-capacity analysis, prioritized optimization actions, and verified savings.

## Stop conditions
Escalate when metrics are missing, ownership is ambiguous, or changes can destabilize production scheduling.
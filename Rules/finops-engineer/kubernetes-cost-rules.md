# Kubernetes Cost Rules

## Purpose
Provide defensible Kubernetes cost visibility and optimization while preserving scheduling and reliability requirements.

## Scope
Clusters, nodes, namespaces, workloads, requests, limits, autoscaling, shared platform overhead, and accelerator usage.

## MUST
- Allocate node and shared-cluster costs using documented workload attribution and overhead rules.
- Evaluate CPU and memory requests against representative utilization and scheduling requirements.
- Include idle capacity, system workloads, storage, networking, control-plane, and accelerator costs where material.
- Validate optimization recommendations with workload owners before production changes.

## MUST NOT
- Treat pod utilization alone as total cluster efficiency.
- Reduce requests below safe operating requirements merely to improve allocation metrics.
- Ignore availability topology, disruption budgets, autoscaling behavior, or failover headroom.

## SHOULD
- Track cost per workload or business unit alongside utilization and service-level indicators.

## Exceptions
Shared platform costs may use proxy allocation when direct attribution is impractical, with documented methodology.

## Verification
Compare cluster billing, node inventory, workload telemetry, requests/limits, autoscaling history, allocation totals, and post-change reliability.
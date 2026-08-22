# Kubernetes Observability

## Purpose
Observe application and platform behavior in Kubernetes while separating workload failures from scheduling, networking, storage, and node problems.

## When to use
Use for containerized workloads running on Kubernetes or when cluster-level symptoms affect application reliability.

## Inputs
Cluster topology, workloads, namespaces, controllers, ingress, CNI, storage, metrics, logs, and traces.

## Context to inspect
Inspect pod lifecycle, restarts, requests/limits, throttling, OOM events, scheduling, node pressure, ingress, DNS, volumes, and control-plane signals.

## Core knowledge
Pods are ephemeral; stable workload identity should come from deployment/service metadata. Container CPU usage without throttling and limits can be misleading. Kubernetes events are useful but short-lived.

## Procedure
1. Standardize cluster, namespace, workload, pod, and container identity.
2. Collect workload and node resource metrics.
3. Capture restart, scheduling, OOM, and throttling signals.
4. Correlate application telemetry with workload metadata.
5. Monitor ingress, DNS, networking, and storage dependencies.
6. Build workload and cluster drill-down views.
7. Alert on user-impacting symptoms rather than every pod event.
8. Test rolling deployments and node failures.

## Decision points
Retain pod identity for diagnostics but aggregate operational metrics by stable workload where possible.

## Common failure patterns
Paging on pod restarts alone, cardinality from ephemeral labels, ignoring CPU throttling, and collecting cluster metrics without application correlation.

## Verification
Simulate restart, OOM, deployment, and node-pressure scenarios and confirm responders can distinguish their causes.

## Expected output
Correlated Kubernetes platform and application observability.

## Stop conditions
Escalate when required cluster telemetry needs permissions outside the approved security boundary.
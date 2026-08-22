# Kubernetes Reliability Rules

## Purpose
Ensure Kubernetes workloads remain observable, schedulable, recoverable, and safe under node or pod failure.

## Scope
Applies to production Kubernetes workloads, controllers, probes, resource settings, disruption policies, and cluster operations.

## MUST
- Workloads MUST define resource requests based on observed behavior and capacity constraints.
- Readiness probes MUST represent ability to serve traffic; liveness probes MUST not cause restart loops for slow-but-recoverable dependencies.
- Critical workloads MUST define disruption and availability behavior appropriate to their redundancy model.
- Rollouts MUST account for surge, unavailable capacity, startup time, and dependency pressure.
- Stateful workloads MUST define storage durability and recovery procedures.

## MUST NOT
- MUST NOT use overly aggressive liveness probes to mask application failures.
- MUST NOT rely on default resource behavior for critical workloads without capacity evidence.
- MUST NOT assume replica count alone provides fault tolerance across correlated failure domains.

## SHOULD
- Distribute critical replicas across appropriate failure domains.
- Test node loss and rolling maintenance behavior for important services.

## Exceptions
Nonstandard probe or disruption behavior requires documented failure rationale and verification.

## Verification
Inspect manifests, rollout history, scheduling events, probe behavior, resource metrics, disruption tests, and cluster failure simulations.
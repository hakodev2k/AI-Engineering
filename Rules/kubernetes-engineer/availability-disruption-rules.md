# Availability and Disruption Rules
## Purpose
Keep critical workloads available during failures, maintenance, and voluntary disruption.
## Scope
Replicas, probes, PodDisruptionBudgets, topology, rollout behavior, and maintenance.
## MUST
- Define availability objectives and map critical workloads to sufficient replicas and failure-domain placement.
- Configure disruption budgets where voluntary disruption could violate service objectives.
- Ensure readiness reflects ability to serve traffic and liveness does not create restart loops for recoverable dependency failures.
- Validate maintenance and node-drain behavior for critical services.
## MUST NOT
- Use probes as substitutes for application-level resilience.
- Configure disruption constraints that make routine maintenance impossible without an explicit operating plan.
## SHOULD
- Test representative node, pod, and dependency failures.
## Exceptions
Singleton workloads require documented recovery behavior and accepted downtime.
## Verification
Review manifests, availability metrics, disruption events, drain tests, and failure exercises.
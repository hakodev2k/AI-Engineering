# Kubernetes Rules

## Purpose
Define safe operational standards for Kubernetes workloads and clusters.

## Scope
Applies to manifests, Helm charts, operators, workload configuration, and cluster-facing policies.

## MUST
- Workloads MUST define resource requests and limits appropriate to observed behavior.
- Readiness and liveness behavior MUST reflect real application health.
- Namespace, service account, RBAC, and network boundaries MUST follow least privilege.
- Stateful workloads MUST define persistence, backup, and recovery expectations.
- High-risk cluster changes MUST be reviewed and staged before production rollout.

## MUST NOT
- MUST NOT grant cluster-admin to workloads without explicit security approval.
- MUST NOT expose services publicly by default.
- MUST NOT rely on pod restarts to hide recurring application failures.

## SHOULD
- Prefer declarative manifests managed through Git-based workflows.
- Prefer PodDisruptionBudgets, anti-affinity, and autoscaling when availability requirements justify them.

## Exceptions
Deviation requires documented operational need, blast radius, security review, and rollback plan.

## Verification
Use manifest validation, policy engines, RBAC inspection, network tests, resource telemetry, rollout history, and disaster-recovery exercises.
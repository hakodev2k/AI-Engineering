# Container and Kubernetes Architecture Rules

## Purpose
Use container orchestration only with explicit workload, security, reliability, and operating-model justification.

## Scope
Applies to managed Kubernetes, container platforms, cluster topology, namespaces, workload isolation, autoscaling, ingress, and platform dependencies.

## MUST
- Kubernetes adoption MUST be justified by workload and platform requirements rather than standardization preference alone.
- Cluster and namespace boundaries MUST reflect trust, ownership, blast-radius, and lifecycle requirements.
- Workloads MUST define resource requests and limits, health behavior, disruption expectations, and scaling constraints appropriate to their runtime.
- Privileged containers, host access, or broad cluster permissions MUST require explicit security justification and review.
- Critical cluster add-ons and control dependencies MUST have version, upgrade, availability, and ownership plans.

## MUST NOT
- MUST NOT treat namespace separation as equivalent to a strong security boundary without validating the threat model and controls.
- MUST NOT expose cluster administration endpoints broadly to the internet without explicit necessity and safeguards.
- MUST NOT perform production cluster upgrades without compatibility validation and rollback or recovery planning.

## SHOULD
- Prefer managed control planes when they reduce operational risk without violating requirements.
- Minimize cluster-level bespoke components and privileged extensions.

## Exceptions
Exceptions require documented workload need, security and reliability risk, alternative considered, controls, and approval.

## Verification
Review cluster topology, IAM/RBAC, network policy, workload specifications, admission controls, resource settings, upgrade tests, and operational telemetry.
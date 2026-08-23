# Container and Kubernetes Testing

## Purpose
Assess containerized workloads and Kubernetes environments for reachable privilege escalation, isolation failures, exposed control surfaces, and unsafe workload identities.

## When to use
Use for explicitly scoped clusters, registries, images, namespaces, and container workloads.

## Inputs
Cluster scope, namespaces, test service accounts, manifests, network policies, image/registry context, and safety constraints.

## Context to inspect
Inspect API access, RBAC, service accounts, pod security, secrets, host mounts, capabilities, admission controls, network policies, registries, and cloud workload identity.

## Core knowledge
Container risk spans image, runtime, orchestrator, identity, and underlying host/cloud boundaries. A configuration issue becomes material when it enables an attacker path or violates an isolation invariant.

## Procedure
1. Confirm cluster and namespace boundaries.
2. Enumerate effective permissions for approved identities.
3. Review workload security contexts and dangerous capabilities/mounts.
4. Test secret and configuration exposure.
5. Validate namespace and network isolation.
6. Inspect service-account token use and workload identity mappings.
7. Review exposed dashboards, APIs, and registries.
8. Model privilege paths toward cluster/host/cloud control.
9. Validate paths using reversible, low-impact actions.
10. Remove test resources and document remediation.

## Decision points
Use manifest/policy evidence when exploitation adds risk without increasing confidence. Avoid host escape attempts unless explicitly authorized in a safe environment.

## Common failure patterns
Equating container root with host root, ignoring RBAC aggregation, creating privileged pods casually, leaving test workloads, and overlooking cloud identity attached to pods.

## Verification
Confirm effective permissions, isolation behavior, audit evidence, and cleanup of every test resource.

## Expected output
Validated findings with workload/identity path, violated isolation boundary, evidence, impact, and remediation.

## Stop conditions
Stop before host-impacting exploitation, uncontrolled scheduling, destructive cluster changes, or access outside approved namespaces/accounts.
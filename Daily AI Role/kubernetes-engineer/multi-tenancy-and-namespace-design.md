# Multi-Tenancy and Namespace Design

## Purpose
Create Kubernetes tenancy boundaries that balance isolation, autonomy, governance, and platform operability.
## When to use
Shared clusters, team onboarding, regulated workloads, quota design, or blast-radius reduction.
## Inputs
Tenant trust levels, workload sensitivity, ownership model, resource demand, compliance requirements.
## Context to inspect
Namespaces, RBAC, quotas, LimitRanges, NetworkPolicies, Pod Security, node pools, admission policy, observability access.
## Core knowledge
Namespaces are administrative boundaries, not complete security boundaries. Strong isolation may require dedicated nodes or clusters depending on trust and compliance.
## Procedure
1. Classify tenants by trust/sensitivity. 2. Define namespace lifecycle and ownership. 3. Scope RBAC. 4. Apply quotas/default resources. 5. Segment networks. 6. Enforce workload security baseline. 7. Separate nodes/clusters where threat model requires. 8. Partition observability and secret access. 9. Test cross-tenant negative paths.
## Decision points
Use shared namespaces only for tightly coupled ownership; separate namespaces for routine team/workload boundaries; separate clusters for hard isolation, independent lifecycle, or regulatory boundaries.
## Common failure patterns
Namespace equals security assumption, shared service accounts, no quotas, unrestricted cross-namespace traffic, and cluster-scoped CRDs/controllers granting unintended power.
## Verification
Test RBAC, network, quota, secret, node, and observability boundaries from tenant identities.
## Expected output
Documented tenancy model with controls, exceptions, and tested isolation.
## Stop conditions
Escalate when trust/compliance requirements cannot be satisfied by the proposed cluster boundary.
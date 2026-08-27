# Multi-Tenancy Isolation

## Purpose
Design defensible isolation between Kubernetes tenants with controls proportional to trust and impact.

## When to use
Use for shared clusters, internal platform teams, SaaS tenant workloads, or consolidating environments.

## Inputs
Tenant trust levels, data sensitivity, workload privileges, performance requirements, compliance constraints, and platform capabilities.

## Preconditions
Define what a tenant is and which cross-tenant interactions are allowed.

## Context to inspect
Inspect namespaces, RBAC, network policy, admission, quotas, node scheduling, runtime classes, storage, secrets, operators/CRDs, ingress, DNS, and cluster-scoped resources.

## Core knowledge
Namespaces provide organizational scope, not complete hostile-tenant isolation. Stronger boundaries may require dedicated nodes, clusters, accounts/projects, or virtualization/sandboxing.

## Procedure
1. Classify tenant trust and blast-radius requirements.
2. Map shared cluster-scoped components.
3. Establish namespace/RBAC separation.
4. Apply default-deny networking and admission controls.
5. Prevent unsafe host/privileged access.
6. Isolate storage and credentials.
7. Apply quotas to reduce noisy-neighbor/DoS risk.
8. Separate nodes or clusters for stronger trust boundaries.
9. Test cross-tenant access attempts.

## Decision points
Use separate clusters when tenants are mutually hostile, compliance requires hard separation, or shared cluster-scoped administration creates unacceptable risk.

## Common failure patterns
Treating namespace as hard isolation; shared privileged operators; cross-tenant secrets; broad network access; shared nodes for hostile privileged workloads.

## Verification
Run negative tests across API, network, storage, identity, scheduling, and privileged workload paths.

## Expected output
An explicit tenancy model with enforced boundaries and documented residual shared risks.

## Stop conditions
Escalate when required tenant isolation exceeds what the chosen shared-cluster architecture can credibly provide.
# RBAC and Workload Identity

## Purpose
Design least-privilege Kubernetes API and cloud-service access for humans and workloads.
## When to use
New service accounts, access reviews, cloud workload identity, or authorization incidents.
## Inputs
Actor, required operations, resource scope, namespace, cloud permissions, audit evidence.
## Context to inspect
Roles, ClusterRoles, bindings, service accounts, token automount, impersonation, cloud identity mappings, audit logs.
## Core knowledge
RBAC grants verbs over API resources and is additive; cluster-wide grants expand blast radius. Workload identity should avoid long-lived cloud credentials.
## Procedure
1. Identify actor and exact tasks. 2. Derive minimum verbs/resources. 3. Scope to namespace where possible. 4. Use dedicated service accounts. 5. Disable unnecessary token automount. 6. Map cloud permissions through workload identity. 7. Test with authorization checks. 8. Review audit logs and expiry/ownership.
## Decision points
Use ClusterRole only for genuine cluster scope; prefer group-based human access and short-lived federated workload credentials.
## Common failure patterns
cluster-admin convenience grants, wildcard verbs/resources, shared service accounts, static cloud keys, and bindings with unclear owners.
## Verification
Use can-i/authorization APIs, negative tests, cloud permission tests, and audit review.
## Expected output
Minimal grants with actor, scope, rationale, owner, and evidence.
## Stop conditions
Stop if required privileges are unclear or privileged access lacks an accountable approver.
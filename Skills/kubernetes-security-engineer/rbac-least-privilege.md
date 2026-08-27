# RBAC Least Privilege

## Purpose
Design and review Kubernetes authorization so humans and workloads receive only the permissions required.

## When to use
Use when adding service accounts, Roles, ClusterRoles, bindings, operators, CI identities, or investigating excessive privilege.

## Inputs
Required operations, manifests, RBAC objects, service accounts, identity-provider mappings, audit logs, and namespace ownership.

## Preconditions
Know the actual subject and required verbs/resources. Do not infer permissions from job titles alone.

## Context to inspect
Review aggregated roles, wildcard verbs/resources, subresources, impersonation, bind/escalate permissions, secrets access, pods/exec, pods/attach, token creation, and cluster-wide bindings.

## Core knowledge
RBAC is additive and has no deny rule. Seemingly narrow permissions can enable escalation, especially workload creation, secret reads, role binding, impersonation, and privileged pod creation.

## Procedure
1. Identify subject and exact tasks.
2. Inventory effective bindings.
3. Resolve aggregated ClusterRoles.
4. Remove wildcards where feasible.
5. Separate namespace and cluster scope.
6. Check escalation-capable permissions.
7. Create minimal roles and bindings.
8. Test authorized and unauthorized actions.
9. Document exceptional privileges and review dates.

## Decision points
Use Role over ClusterRole when namespace scope is sufficient. Prefer dedicated service accounts over shared identities. Split operational duties when one role would combine dangerous capabilities.

## Common failure patterns
Binding cluster-admin for convenience; granting secrets broadly; assuming read-only roles are harmless; reusing service accounts; ignoring operator-created RBAC.

## Verification
Use authorization checks and representative API calls for positive and negative cases. Re-scan effective privileges after deployment.

## Expected output
Minimal RBAC manifests plus evidence that required operations work and prohibited operations fail.

## Stop conditions
Escalate when required functionality inherently grants cluster takeover capability or identity ownership is unclear.
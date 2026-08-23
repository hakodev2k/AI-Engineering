# RBAC and Identity Rules
## Purpose
Ensure Kubernetes identities receive only the permissions required for their responsibilities.
## Scope
Users, groups, service accounts, Roles, ClusterRoles, bindings, and workload identity.
## MUST
- Apply least privilege and scope permissions to namespaces whenever cluster-wide access is unnecessary.
- Use distinct service accounts for workloads with different authorization needs.
- Review wildcard verbs/resources and privilege-escalating permissions before approval.
- Prefer short-lived federated workload identity over static cloud credentials where supported.
## MUST NOT
- Bind routine workloads or users to cluster-admin.
- Share service-account credentials across unrelated workloads.
## SHOULD
- Periodically review effective permissions and stale bindings.
## Exceptions
Emergency elevation must be time-bounded, attributable, auditable, and revoked after use.
## Verification
Inspect RBAC manifests, effective authorization checks, audit logs, service-account usage, and identity-provider configuration.
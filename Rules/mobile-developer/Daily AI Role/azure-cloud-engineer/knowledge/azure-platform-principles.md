# Azure Platform Principles

- Treat tenant, management group, subscription, resource group, and resource scopes as distinct governance boundaries.
- Prefer workload identities and short-lived authorization over stored credentials.
- Private connectivity changes frequently depend on DNS as much as networking; verify both.
- Control-plane deployment success does not prove application/data-plane success.
- Availability Zones reduce some failures; regional DR addresses a different failure class.
- Autoscale cannot compensate for exhausted subscription/service quotas.
- Backups are useful only when restore procedures and ownership are tested.
- Azure Policy and RBAC solve different control problems: policy constrains resource state; RBAC controls actor permissions.
- IaC reduces drift only when manual mutation is controlled and reconciliation is performed.

# Multi-Tenancy Rules

## Purpose
Prevent cross-team interference while enabling shared platform services.

## Scope
Applies to namespaces, accounts, projects, clusters, quotas, shared services, and tenant-scoped data or configuration.

## MUST
- Tenant boundaries MUST be explicit in identity, data, resource, and policy design.
- Quotas and limits MUST prevent one tenant from exhausting shared capacity.
- Cross-tenant administrative operations MUST be auditable.
- Tenant-scoped data MUST be isolated according to the platform threat model.

## MUST NOT
- MUST NOT rely solely on naming conventions for security isolation.
- MUST NOT expose one tenant's secrets, logs, metadata, or resources to another without authorization.
- MUST NOT introduce shared mutable configuration without ownership and blast-radius analysis.

## SHOULD
- Prefer isolation mechanisms enforced by underlying platform primitives.
- Test noisy-neighbor and quota-exhaustion scenarios.

## Exceptions
Intentional shared resources require documented trust assumptions, access controls, and risk acceptance.

## Verification
Use isolation tests, IAM review, quota tests, audit logs, configuration inspection, and adversarial cross-tenant scenarios.
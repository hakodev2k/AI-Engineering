# Multi-Tenancy Rules

## Purpose
Protect isolation, fairness, and predictable service across shared AI infrastructure.

## Scope
Applies to shared clusters, namespaces, quotas, storage, networks, and accelerator pools.

## MUST
- Tenants MUST have explicit resource, identity, network, and data-isolation boundaries.
- Quotas and priority policies MUST prevent one tenant from exhausting shared critical capacity.
- Privileged tenant exceptions MUST be traceable and time-bounded.
- Shared caches and storage MUST prevent unauthorized cross-tenant data access.

## MUST NOT
- MUST NOT rely on naming conventions as an isolation control.
- MUST NOT grant broad cluster privileges solely for operational convenience.
- MUST NOT expose another tenant's model, prompt, dataset, logs, or metadata.

## SHOULD
- Noisy-neighbor signals SHOULD be observable per tenant.
- High-risk workloads SHOULD use stronger isolation when justified.

## Exceptions
Exceptions require security review, blast-radius analysis, expiry, and accountable approval.

## Verification
Inspect IAM, quotas, network policy, storage ACLs, privilege assignments, tenancy tests, and resource-usage telemetry.
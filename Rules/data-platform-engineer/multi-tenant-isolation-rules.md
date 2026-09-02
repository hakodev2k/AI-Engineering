# Multi-Tenant Isolation Rules

## Purpose
Protect shared platform tenants from data leakage, noisy-neighbor failures, and uncontrolled resource contention.

## Scope
Applies to shared compute, storage, metadata, queues, namespaces, schedulers, and platform control planes serving multiple teams or workloads.

## MUST
- Tenant identity and ownership MUST be explicit at authorization, resource-allocation, and observability boundaries.
- Data, metadata, credentials, and temporary artifacts MUST be isolated according to the platform's documented trust model.
- Shared compute MUST enforce quotas, concurrency controls, or equivalent safeguards where one tenant can materially affect others.
- Cross-tenant administrative operations MUST be auditable and restricted to approved privileged roles.
- Platform limits MUST define predictable behavior when quotas or capacity boundaries are exceeded.

## MUST NOT
- MUST NOT rely on naming conventions alone as a security boundary.
- MUST NOT allow tenant-controlled identifiers to select another tenant's resources without authorization checks.
- MUST NOT raise or bypass production isolation controls merely to resolve a capacity issue without explicit approval.

## SHOULD
- Prefer isolation mechanisms enforced by infrastructure or policy rather than application convention.
- SHOULD expose tenant-level resource usage and saturation signals.

## Exceptions
Exceptions require documented trust assumptions, blast radius, compensating controls, evidence, expiry where temporary, and security/platform approval.

## Verification
Use authorization tests, cross-tenant negative tests, quota tests, resource metrics, configuration inspection, audit logs, and failure-isolation exercises.
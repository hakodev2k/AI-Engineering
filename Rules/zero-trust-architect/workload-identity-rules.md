# Workload Identity Rules

## Purpose
Ensure services, applications, jobs, containers, and automation authenticate with strong, attributable workload identities.

## Scope
Applies to service-to-service communication, CI/CD, cloud workloads, containers, serverless functions, jobs, and automation.

## MUST
- Every production workload MUST have a unique identity or a narrowly scoped identity shared only when technically unavoidable and documented.
- Workload credentials MUST be short-lived, automatically rotated, or dynamically issued where the platform supports it.
- Authorization MUST bind workload identity to explicit resources and actions using least privilege.
- Identity issuance MUST validate workload provenance or platform attestation appropriate to the environment.
- Production and non-production workload identities MUST be separated.
- Workload identity usage MUST be auditable and attributable to a deployment, service, or execution context.

## MUST NOT
- Static secrets embedded in source, images, deployment manifests, or user-accessible configuration MUST NOT be used as workload identity when managed identity mechanisms are available.
- One broad service principal MUST NOT be reused across unrelated workloads solely for convenience.
- Workload credentials MUST NOT be copied between environments without explicit approval.
- A successful TLS connection MUST NOT be treated as proof of workload authorization unless identity is authenticated and policy evaluated.

## SHOULD
- Mutual TLS, workload identity federation, managed identities, or SPIFFE-like mechanisms SHOULD be preferred where supported.
- Identity issuance SHOULD be automated through the deployment platform rather than manually provisioned.

## Exceptions
Exceptions require documented technical constraint, risk, compensating controls, expiry, owner, and security approval for production use.

## Verification
Inspect service identities, token lifetimes, trust policies, deployment configuration, secret scans, audit logs, and negative authorization tests. Verify unrelated workloads cannot impersonate one another.
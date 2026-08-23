# Cloud Penetration Testing

## Purpose
Assess cloud-hosted systems and control planes for exploitable identity, configuration, trust, and workload weaknesses while respecting provider and customer authorization boundaries.

## When to use
Use for explicitly scoped cloud accounts/subscriptions/projects, workloads, identities, storage, serverless services, and management planes.

## Inputs
Cloud scope, test identities, architecture, account hierarchy, provider constraints, logging contacts, and production safety requirements.

## Context to inspect
Inspect IAM, federation, metadata/identity endpoints, storage, secrets, networking, workload identities, CI/CD trust, serverless permissions, control-plane exposure, and cross-account relationships.

## Core knowledge
Cloud compromise often follows identity and trust graphs rather than host-by-host exploitation. Effective permissions can differ from declared roles because of inheritance, resource policies, conditions, and federation.

## Procedure
1. Confirm provider-specific authorization and account boundaries.
2. Map identities, roles, resource policies, and trust relationships.
3. Identify public and cross-account exposure.
4. Review workload credentials and secret paths.
5. Test privilege boundaries using controlled identities.
6. Evaluate storage and data-service access.
7. Inspect network paths and management interfaces.
8. Review automation/CI trust and deployment identities.
9. Validate candidate escalation paths with minimum privilege impact.
10. Capture cloud-native evidence and remediation at the policy/trust boundary.

## Decision points
Prefer permission simulation/read-only evidence when it proves risk. Execute privilege escalation only when explicitly permitted and reversible.

## Common failure patterns
Treating cloud as traditional network testing, ignoring resource policies, changing production IAM unnecessarily, leaving created resources behind, and crossing organization/account boundaries.

## Verification
Confirm effective permissions, reproduce with scoped test identities, inspect audit logs where available, and verify cleanup.

## Expected output
Cloud findings with identity/resource path, effective permission evidence, impact, cleanup status, and least-privilege remediation.

## Stop conditions
Stop before unapproved privilege changes, destructive resource actions, uncontrolled cost, or cross-account access outside scope.
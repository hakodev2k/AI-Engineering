# Data Access Security

## Purpose
Design least-privilege access controls for data platforms across users, workloads, datasets, and administrative planes.

## When to use
Use during platform design, dataset onboarding, IAM reviews, incident remediation, or multi-tenant expansion.

## Inputs
Identity sources, data classifications, personas, service workloads, compliance requirements, and audit needs.

## Context to inspect
IAM roles, group mappings, service identities, storage policies, database grants, secrets, network boundaries, and access logs.

## Core knowledge
Authorization should be identity-based, least-privilege, auditable, and separated by environment. Human and workload identities have different lifecycle risks. Row/column controls are useful but can create performance and policy complexity.

## Procedure
1. Inventory identities and privileged paths.
2. Map data classifications to permitted personas and purposes.
3. Prefer groups/roles over direct user grants.
4. Give workloads dedicated identities with minimum permissions.
5. Separate administration, data access, and deployment privileges.
6. Implement fine-grained controls only where coarse boundaries are insufficient.
7. Centralize secret storage and rotation.
8. Enable immutable or protected audit trails.
9. Define access review and emergency-access procedures.
10. Test denied paths as rigorously as allowed paths.
11. Monitor privilege escalation and anomalous access.

## Decision points
Use dataset-level controls for simplicity; row/column policies when tenancy or sensitivity requires them. Prefer short-lived credentials and federation over static keys whenever supported.

## Common failure patterns
Shared service accounts, wildcard grants, permanent emergency access, secrets in code, production access inherited from development groups, and audit logs that administrators can silently alter.

## Verification
Run positive and negative authorization tests, inspect effective permissions, rotate credentials, verify audit events, and perform periodic access recertification.

## Expected output
Role model, policies, service identities, secret controls, audit coverage, tests, and access-review process.

## Stop conditions
Escalate when requested access violates policy, identity provenance is uncertain, or privileged production changes lack required approval.
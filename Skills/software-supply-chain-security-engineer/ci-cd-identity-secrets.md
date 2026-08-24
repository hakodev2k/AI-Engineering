# CI/CD Identity and Secrets

## Purpose
Minimize credential exposure and constrain automation identities so a pipeline compromise cannot become unrestricted infrastructure compromise.

## When to use
Use when designing CI/CD authentication, rotating secrets, integrating cloud services, or reviewing pipeline permissions.

## Inputs
Workflow definitions, secret stores, IAM policies, service accounts, OIDC configuration, environment protections, and audit logs.

## Context to inspect
Map every credential from issuance to use and revocation. Identify which jobs can access it, whether untrusted code executes first, token lifetime, audience, scope, and downstream permissions.

## Core knowledge
Prefer short-lived, workload-bound credentials over static secrets. Identity federation reduces secret custody but must tightly validate issuer, subject, audience, repository, branch/environment, and workflow claims.

## Procedure
1. Inventory pipeline identities and static secrets.
2. Remove unused credentials.
3. Replace long-lived credentials with federated short-lived identity where practical.
4. Scope permissions to the minimum resource and action set.
5. Gate production identity issuance on protected workflow context.
6. Prevent secret access from untrusted contributions.
7. Mask sensitive output and prevent credentials entering artifacts/caches.
8. Centralize issuance and usage audit logs.
9. Define rotation and emergency revocation.
10. Test token misuse outside the intended workflow.

## Decision points
Use static secrets only when federation is unavailable and compensate with strict scope, storage, rotation, and monitoring. Separate build identity from deployment identity.

## Common failure patterns
Cloud-admin CI roles; OIDC trust policies with broad wildcards; secrets available to all jobs; credentials copied into images; no revocation plan; trusting masking as leakage prevention.

## Verification
Inspect issued token claims and effective permissions. Attempt access from unauthorized branches/jobs and confirm denial.

## Expected output
A least-privilege CI/CD identity model with minimal persistent secrets and auditable issuance.

## Stop conditions
Escalate on suspected secret disclosure, unbounded trust policies, inability to revoke credentials, or production access that cannot be scoped safely.
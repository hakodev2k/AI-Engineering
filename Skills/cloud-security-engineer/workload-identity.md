# Workload Identity

## Purpose
Authenticate cloud workloads without long-lived embedded credentials and constrain machine-to-machine authorization.

## When to use
Use for applications, CI/CD runners, containers, serverless functions, and cross-cloud service access.

## Inputs
Runtime platform, trust issuer, deployment topology, target APIs, current credentials, and authorization requirements.

## Context to inspect
Inspect token issuance, audience, subject claims, role assumption, secret stores, runtime metadata access, and deployment manifests.

## Core knowledge
Prefer federated or platform-native workload identity, short token lifetimes, explicit audiences, narrow subjects, and independent authorization at the target.

## Procedure
1. Inventory machine credentials.
2. Map each workload to a unique identity.
3. Define issuer, subject, audience, and trust conditions.
4. Replace static keys with short-lived token exchange where supported.
5. Grant minimal target permissions.
6. Protect metadata/token endpoints.
7. Rotate or revoke legacy credentials.
8. Add authentication failure telemetry.
9. Test impersonation and replay boundaries.

## Decision points
Use native identity for same-cloud workloads; use federation for external CI or cross-cloud workloads when trust can be tightly constrained.

## Common failure patterns
Shared identities, broad subject wildcards, reusable keys in environment variables, audience omission, and trusting identity without target authorization.

## Verification
Confirm no unnecessary static credential remains, expected token claims are enforced, denied subjects fail, and audit trails identify the workload.

## Expected output
A credential-minimized workload identity configuration with verified trust and authorization boundaries.

## Stop conditions
Escalate if the platform cannot issue bounded credentials, migration would strand critical workloads, or trust claims cannot uniquely identify the workload.
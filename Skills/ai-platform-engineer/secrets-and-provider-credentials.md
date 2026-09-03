# Secrets and Provider Credentials

## Purpose
Design secure credential handling for AI providers, internal model endpoints, vector stores, and supporting services.

## When to use
Use when onboarding providers, rotating credentials, reviewing secret exposure risk, or migrating from application-owned keys to centralized platform identity.

## Inputs
- Provider authentication mechanisms
- Cloud/IAM capabilities
- Tenant model
- Runtime environments
- Rotation requirements

## Context to inspect
Inspect source repositories, CI/CD variables, runtime secret stores, logs, dashboards, notebooks, developer machines, container definitions, and existing provider accounts.

## Core knowledge
Prefer short-lived workload identity and scoped tokens over static shared secrets. Credentials require least privilege, rotation, revocation, auditability, environment separation, and controls preventing accidental logging or prompt inclusion.

## Procedure
1. Inventory credentials and every location they can appear.
2. Classify secrets by environment, provider, tenant, and privilege.
3. Replace static credentials with workload identity where supported.
4. Otherwise store secrets in an approved secret manager.
5. Scope provider permissions and budgets to the minimum needed.
6. Separate development, staging, and production identities.
7. Remove secrets from code, images, logs, prompts, and telemetry.
8. Automate rotation where feasible.
9. Define revocation and break-glass procedures.
10. Test expired, revoked, and unavailable-secret behavior.
11. Audit access to secret values and administrative operations.
12. Document ownership and rotation cadence.

## Decision points
Use per-tenant or per-service credentials when isolation and attribution justify operational cost. Centralized provider credentials are acceptable only with compensating authorization, quotas, and audit controls.

## Common failure patterns
Long-lived shared keys, secrets in notebooks, provider keys logged in HTTP traces, no rotation ownership, production credentials used locally, and break-glass access without audit.

## Verification
Verify repository scans, runtime configuration, access policies, rotation, revocation, log redaction, and negative authentication tests.

## Expected output
A credential architecture with least-privilege access, secure storage, rotation, revocation, audit evidence, and documented ownership.

## Stop conditions
Stop when credential scope cannot be reduced, secret storage is unapproved, or required provider authentication conflicts with organizational security policy.
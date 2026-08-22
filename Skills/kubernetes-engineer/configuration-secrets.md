# Configuration and Secrets

## Purpose
Manage application configuration and sensitive values with safe rollout, rotation, and least exposure.

## When to use
ConfigMap/Secret design, secret rotation, or configuration-related incidents.

## Inputs
Configuration inventory, sensitivity, rotation requirements, ownership, and external secret-store capabilities.

## Context to inspect
Manifests, mounted values, environment variables, RBAC, encryption settings, deployment tooling, and secret providers.

## Core knowledge
Kubernetes Secrets are API objects, not automatically a complete secret-management solution. Configuration changes need explicit rollout semantics.

## Procedure
1. Classify configuration by sensitivity and lifecycle.
2. Keep secrets out of source and images.
3. Prefer external secret systems where rotation/audit requirements justify them.
4. Restrict RBAC and namespace scope.
5. Define mount/environment delivery intentionally.
6. Establish rotation and workload reload behavior.
7. Prevent secret leakage in logs and diagnostics.
8. Test revocation and rotation.

## Decision points
Use native Secrets for simple controlled environments; external providers for centralized lifecycle, dynamic credentials, or stronger governance.

## Common failure patterns
Secrets in Git, broad read permissions, immutable assumptions, leaked environment dumps, and rotation without application reload.

## Verification
Rotate a test credential, verify consumers update, old credentials fail, and logs/artifacts contain no secret values.

## Expected output
Auditable configuration and secret lifecycle with least privilege.

## Stop conditions
Escalate when required secret storage or encryption controls are unavailable.
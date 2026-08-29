# Secrets Management Rules

## Purpose
Prevent software delivery credentials and sensitive tokens from becoming uncontrolled supply-chain dependencies.

## Scope
Applies to CI/CD credentials, registry tokens, signing credentials, deployment identities, API keys, and automation secrets.

## MUST
- Secrets MUST be stored in approved secret-management systems or platform-protected stores.
- Secret access MUST be least-privileged, auditable, and scoped to the workload that requires it.
- Long-lived credentials MUST have rotation and revocation procedures.
- Suspected exposure MUST trigger prompt containment and validation of affected releases.

## MUST NOT
- MUST NOT commit secrets to source control or embed them in build artifacts.
- MUST NOT print secret values in logs, diagnostics, or test output.
- MUST NOT share production release credentials across unrelated workflows.

## SHOULD
- Workload identity or short-lived credentials SHOULD replace static secrets where supported.
- Secret scanning SHOULD run in repository and CI workflows.

## Exceptions
Exceptions MUST document why a stronger mechanism is unavailable, scope, duration, compensating controls, and approval.

## Verification
Inspect secret stores, workflow references, access policies, rotation records, logs, and scanning results. Confirm privileged credentials are not present in source or artifacts.
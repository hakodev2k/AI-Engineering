# IAM Resilience and Break Glass

## Purpose
Keep critical identity-dependent operations recoverable during identity-provider, network, policy, credential, or administrative failures without creating an easy bypass.

## When to use
Use for business-continuity design, IdP outage planning, conditional-access changes, privileged-access architecture, or recovery exercises.

## Inputs
Critical systems, identity dependencies, privileged roles, outage scenarios, recovery objectives, alternate access mechanisms, and operational owners.

## Context to inspect
Inspect IdP dependencies, DNS/network paths, token/session behavior, admin portals, break-glass identities, offline credentials, vault dependencies, federation, and recovery contacts.

## Core knowledge
Identity systems are tier-zero dependencies. Emergency access must be independent enough to survive likely failures, narrowly scoped enough to avoid becoming a routine bypass, and continuously monitored/tested.

## Procedure
1. Identify critical operations blocked by IAM failure.
2. Model realistic identity and dependency outage scenarios.
3. Define minimum emergency administrative capabilities.
4. Create independently protected break-glass identities/credentials.
5. Exclude them only from controls necessary for survivability.
6. Protect credentials with strong physical/organizational controls.
7. Alert on every emergency-account use.
8. Document activation, approval, recovery, and post-use rotation.
9. Test access regularly without weakening production controls.
10. Update design after architecture or personnel changes.

## Decision points
Offline or alternate credentials improve independence but increase custody risk. Multiple emergency paths may be justified for critical environments if each has strict controls.

## Common failure patterns
Break-glass accounts using the same failing MFA dependency, credentials nobody can locate, broad permanent exemptions, never testing recovery, monitoring dependent on the same outage domain, and routine admin use.

## Verification
Run controlled recovery exercises for policy lockout and IdP dependency failure; verify access, alerting, audit, and credential rotation afterward.

## Expected output
A tested IAM continuity design with emergency identities, dependency analysis, procedures, monitoring, and recovery evidence.

## Stop conditions
Escalate when no independent recovery path exists for critical administration or testing could risk production lockout without approved safeguards.
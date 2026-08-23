# IAM Resilience and Disaster Recovery

## Purpose
Design and verify identity-system resilience so authentication, authorization, privileged administration, and recovery remain trustworthy during outages and disasters.

## When to use
Use for IAM architecture, business-continuity planning, IdP migrations, major dependency changes, or recovery exercises.

## Inputs
Identity dependencies, availability targets, RTO/RPO, backup capabilities, emergency access requirements, federation dependencies, regional topology.

## Context to inspect
IdP and directory topology, DNS, certificates, signing keys, sync services, MFA dependencies, secret stores, admin access, backups, runbooks, prior outage evidence.

## Core knowledge
IAM is often a dependency for every other recovery action. Resilience must avoid both total lockout and insecure fail-open behavior. Recovery keys, emergency accounts, and offline procedures need independent protection and testing.

## Procedure
1. Map critical identity dependencies and single points of failure.
2. Define service-specific RTO/RPO and acceptable degraded modes.
3. Protect emergency administrator access independently of normal federation paths.
4. Back up required configuration, keys, metadata, and directory state where supported.
5. Design regional/provider failure behavior.
6. Define certificate and signing-key recovery procedures.
7. Test loss of MFA, directory sync, federation, DNS, and primary IdP components.
8. Verify applications fail securely when identity dependencies are unavailable.
9. Exercise restoration in an isolated environment.
10. Record recovery evidence, gaps, owners, and retest dates.

## Decision points
Use redundancy when it preserves consistent trust; avoid multi-provider complexity when divergent identity state creates greater risk than the outage it mitigates.

## Common failure patterns
Break-glass accounts dependent on the failed IdP, backups that omit signing material, expired offline credentials, fail-open applications, and untested runbooks.

## Verification
Run recovery exercises against defined RTO/RPO and prove authentication, privilege, federation, and audit integrity after restoration.

## Expected output
Dependency map, recovery architecture, emergency-access plan, tested runbook, evidence, and residual risks.

## Stop conditions
Escalate when recovery cannot be tested safely, critical keys/configuration cannot be restored, or degraded operation would violate mandatory security boundaries.
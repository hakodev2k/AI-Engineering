# Identity and Access Migration

## Purpose
Migrate authentication, authorization, workload identities, and privileged access without locking out users or expanding privilege.

## When to use
Use when cloud migration changes identity providers, federation, service identities, roles, directories, or access boundaries.

## Inputs
Identity architecture, user/group inventories, service accounts, role mappings, application auth configuration, privileged-access model, certificates/secrets, and break-glass requirements.

## Preconditions
Authoritative identity sources, ownership, and security policy must be known. Critical service identities must be inventoried.

## Context to inspect
Inspect SSO/federation, claims, groups, nested membership, conditional access, MFA, local accounts, API credentials, managed/workload identities, role assignments, key rotation, and emergency access.

## Core knowledge
Human and workload identities have different lifecycle needs. Group/role translation can silently broaden access. Federation dependencies can create circular failures during outages or cutovers.

## Procedure
1. Inventory human, machine, and privileged identities used by the migration unit.
2. Map source roles/groups to target permissions.
3. Remove stale or unexplained access before migration where safe.
4. Design federation and trust relationships.
5. Prefer workload identity or short-lived credentials over copied secrets.
6. Establish target RBAC with least privilege.
7. Configure MFA/conditional access and privileged elevation.
8. Test authentication and authorization for representative personas.
9. Test service-to-service authentication and credential rotation.
10. Validate break-glass access independently of normal federation.
11. Monitor denied and anomalous access during cutover.
12. Remove temporary migration privileges after stabilization.

## Decision points
Federate when centralized identity and lifecycle are desired; synchronize only when target requirements demand it. Use managed identities when platform support removes secret handling. Preserve local emergency access only under controlled break-glass procedures.

## Common failure patterns
Mapping groups one-to-one without privilege review; forgotten service accounts; secrets embedded in configuration; break-glass path depends on failed federation; temporary admin grants persist; authorization tested only as administrator.

## Verification
Test least-privileged personas, denied paths, service identities, MFA, privilege elevation, credential rotation, and emergency access. Review target role assignments for unexpected privilege.

## Expected output
A validated identity mapping, target access model, service-identity migration plan, test evidence, and cleanup record.

## Stop conditions
Stop when critical identities lack owners, privilege mapping is ambiguous, emergency access is untested, or migration requires uncontrolled credential sharing.
# Active Directory and Enterprise Identity Testing

## Purpose
Evaluate authorized enterprise identity environments for privilege paths caused by weak delegation, credential exposure, trust relationships, and insecure administrative design.

## When to use
Use for explicitly scoped directory domains, hybrid identity, test accounts, and enterprise authentication infrastructure.

## Inputs
Domain scope, approved identities, architecture, privileged groups, trust boundaries, tiering model, and operational constraints.

## Context to inspect
Inspect directory permissions, group membership, service identities, delegation, certificate services where present, trusts, authentication protocols, endpoint-admin relationships, and hybrid synchronization.

## Core knowledge
Enterprise identity compromise is graph-shaped: individually minor permissions can compose into privilege escalation. Effective access and credential material are sensitive; testing must minimize collection and persistence.

## Procedure
1. Confirm domain/forest and identity scope.
2. Enumerate approved identity context and reachable directory information.
3. Map privileged groups, delegated rights, service accounts, and trusts.
4. Identify plausible privilege paths from scoped starting identities.
5. Validate configuration and permissions before attempting escalation.
6. Test selected paths with reversible actions and test accounts where possible.
7. Evaluate credential protections without harvesting unnecessary secrets.
8. Review administrative tier boundaries and hybrid identity links.
9. Record exact prerequisite chain and control failure.
10. Remove temporary changes and validate cleanup.

## Decision points
Prefer graph/ACL evidence when sufficient. Perform credential or privilege actions only when explicitly authorized and necessary to establish impact.

## Common failure patterns
Dumping credentials unnecessarily, modifying production groups, ignoring nested permissions, treating tool path output as proof, and crossing trusted domains outside scope.

## Verification
Manually validate critical edges in each privilege path, confirm effective rights, and ensure cleanup and credential handling meet engagement rules.

## Expected output
Identity findings describing the privilege chain, prerequisites, evidence, business impact, and hardening priorities.

## Stop conditions
Stop before unapproved credential access, persistence, domain-wide changes, or crossing an unauthorized trust boundary.
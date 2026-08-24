# Active Directory

## Purpose
Preserve directory integrity, availability, recoverability, and predictable administrative behavior.

## Scope
Domains, forests, domain controllers, trusts, sites, replication, FSMO roles, and directory objects.

## MUST
- Directory topology and trust changes MUST document dependencies, blast radius, rollback, and recovery prerequisites.
- Domain controller health and replication MUST be verified before and after material directory changes.
- Schema, forest, domain, trust, and FSMO changes MUST require explicit human approval.
- Critical directory objects MUST be protected by appropriate permissions and recoverable backups.
- Time synchronization and DNS dependencies MUST be treated as directory-critical services.

## MUST NOT
- MUST NOT make irreversible schema changes without compatibility validation and recovery planning.
- MUST NOT seize FSMO roles unless the prior holder is confirmed unavailable and consequences are understood.
- MUST NOT delete directory objects based solely on apparent inactivity without ownership and dependency checks.

## SHOULD
- Keep domain controllers consistently patched and minimize non-directory workloads on them.
- Test forest recovery procedures periodically.

## Exceptions
Exceptions require evidence, risk assessment, recovery path, and approval proportional to forest impact.

## Verification
Use directory health diagnostics, replication status, event logs, DNS checks, backup evidence, configuration review, and post-change authentication tests.
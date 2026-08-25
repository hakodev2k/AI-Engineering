# Security and Access

## Purpose
Prevent migration work from expanding unauthorized access or weakening controls.

## Scope
Covers identities, privileges, network access, temporary tooling, dumps, and operator access.

## MUST
- Migration identities MUST use least privilege and be scoped to required systems and duration.
- Privileged production actions MUST be attributable to an approved identity and auditable.
- Temporary access MUST have an explicit removal condition and owner.

## MUST NOT
- MUST NOT disable authentication, authorization, encryption, or auditing merely to simplify migration.
- MUST NOT share privileged credentials between operators or embed them in scripts.

## SHOULD
- Use short-lived credentials and separate read, write, and administrative identities where practical.
- Review target permissions independently rather than copying legacy privilege sprawl.

## Exceptions
Emergency privilege elevation requires authorized incident procedure, bounded duration, and retrospective review.

## Verification
Inspect IAM policies, database grants, audit logs, network rules, credential lifetime, and post-migration access cleanup.
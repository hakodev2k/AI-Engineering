# Database Access Control Rules

## Purpose
Ensure database privileges are explicit, minimal, reviewable, and aligned with workload identity.

## Scope
Applies to human, service, automation, administrative, and emergency database access.

## MUST
- Access MUST be granted through named roles or groups with least privilege.
- Privileged access MUST be time-bounded where the platform supports it and attributable to an individual or workload identity.
- Read, write, DDL, security-administration, and backup privileges MUST be separated when their risk differs.
- Access changes MUST have an owner, business or operational justification, and auditable record.
- Dormant and orphaned access MUST be reviewed and removed on a defined cadence.

## MUST NOT
- Shared administrator credentials MUST NOT be used for routine operations.
- Application identities MUST NOT receive administrative privileges merely to simplify deployment.
- Authorization MUST NOT rely only on network location.

## SHOULD
- Prefer centralized identity federation and short-lived credentials over database-local passwords.
- High-risk privileges SHOULD require approval independent from the requester.

## Exceptions
Exceptions require documented scope, duration, risk, compensating controls, verification, and accountable approval.

## Verification
Inspect grants and role memberships, identity-provider mappings, access-review evidence, authentication logs, and CI/IaC diffs. Test representative identities to confirm permitted and denied operations.
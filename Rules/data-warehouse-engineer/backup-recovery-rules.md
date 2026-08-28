# Backup and Recovery Rules

## Purpose
Ensure warehouse data and metadata can be recovered after accidental deletion, corruption, failed migration, or platform incident.

## Scope
Applies to snapshots, backups, time travel, replicas, exported metadata, recovery procedures, and restore testing.

## MUST
- Critical warehouse assets MUST have documented recovery objectives and a supported recovery mechanism.
- Destructive migrations and bulk rewrites MUST validate recoverability before execution.
- Recovery procedures MUST include dependent metadata, permissions, and orchestration state where needed for service restoration.
- Restore capability MUST be tested periodically with evidence of achievable recovery time and completeness.

## MUST NOT
- MUST NOT assume provider retention features are sufficient without validating configured duration and scope.
- MUST NOT perform irreversible cleanup before required recovery windows expire.

## SHOULD
- Prefer automated, versioned recovery procedures.
- Recovery exercises SHOULD include realistic dependency failures.

## Exceptions
Reduced recovery coverage requires explicit owner acceptance and documented business impact.

## Verification
Inspect backup configuration, retention settings, restore-test evidence, recovery runbooks, and recent recovery metrics.
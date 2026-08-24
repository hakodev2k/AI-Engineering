# Data Retention and Disposal Rules

## Purpose
Retain data for required periods and dispose of it safely, deliberately, and audibly.

## Scope
Retention schedules, legal holds, lifecycle deletion, media sanitization, cryptographic erasure, and decommissioning.

## MUST
- Retention and disposal controls MUST follow applicable data classification, legal, contractual, and project requirements.
- Destructive deletion of production or protected data MUST verify scope, authority, holds, and recovery implications.
- Media leaving trusted control MUST be sanitized or destroyed using an approved method appropriate to data sensitivity.
- Disposal actions for sensitive data MUST be auditable.

## MUST NOT
- MUST NOT delete data subject to an active hold or unresolved retention requirement.
- MUST NOT assume logical deletion immediately removes all replicas, snapshots, caches, or backups.
- MUST NOT execute broad irreversible deletion without human approval.

## SHOULD
- Automate retention enforcement with protected exceptions and previewable scope.

## Exceptions
Retention deviations require documented authority, reason, duration, and review.

## Verification
Inspect retention policies, hold records, deletion manifests, media certificates, audit logs, and recovery implications.
# Data Lifecycle Rules

## Purpose
Reduce avoidable environmental impact from retaining, copying, and processing data beyond demonstrated business or regulatory need.

## Scope
Applies to application data, telemetry, analytics datasets, backups, caches, intermediate artifacts, and derived data products.

## MUST
- Data retention periods MUST be tied to documented product, operational, legal, security, or analytical requirements.
- High-volume datasets MUST have explicit lifecycle, archival, and deletion policies.
- Changes that reduce retention MUST preserve required recovery, audit, and compliance obligations.
- Derived or duplicated datasets MUST have identified ownership and disposal criteria.

## MUST NOT
- MUST NOT retain data indefinitely by default when no requirement justifies it.
- MUST NOT delete regulated, evidentiary, recovery-critical, or security-relevant data solely to improve sustainability metrics.
- MUST NOT create recurring full copies when incremental, partitioned, or reference-based approaches satisfy the requirement.

## SHOULD
- Prefer automated lifecycle policies over manual cleanup.
- Reassess retention when access frequency materially declines.
- Avoid persisting reproducible intermediate data unless regeneration cost or reliability requirements justify storage.

## Exceptions
Exceptions require the retention rationale, expected volume, impact, alternatives considered, review date, and accountable owner.

## Verification
Inspect retention configurations, lifecycle policies, dataset inventories, storage growth, deletion logs, compliance requirements, and restoration tests where retained data supports recovery.

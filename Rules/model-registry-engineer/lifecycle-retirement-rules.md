# Lifecycle Retirement Rules

## Purpose
Retire obsolete model versions safely without breaking consumers, rollback capability, auditability, or required retention.

## Scope
Deprecation, archive, replacement guidance, consumer discovery, sunset dates, and deletion eligibility.

## MUST
- Deprecation MUST identify the exact model version, reason, replacement guidance when applicable, and intended sunset date.
- Active consumers MUST be identified before a production model is retired.
- Retirement MUST preserve required audit, lineage, and rollback evidence for the mandated period.
- Deletion eligibility MUST be checked separately from deprecation or archive state.
- Consumer migrations MUST be verified before removing a required production version.

## MUST NOT
- MUST NOT delete a version merely because a newer version exists.
- MUST NOT reuse retired immutable version identifiers.
- MUST NOT remove a model with unresolved active consumers or rollback dependencies without explicit approval.

## SHOULD
- Track migration progress and stale consumer references automatically.
- Archive metadata before deleting large inactive artifacts when policy permits.

## Exceptions
Accelerated retirement requires documented operational, security, legal, or cost rationale and approval.

## Verification
Inspect consumer references, deprecation records, migration evidence, retention checks, and deletion audits.
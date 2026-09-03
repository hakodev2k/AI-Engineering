# Deprecation Rules

## Purpose
Retire contract elements without surprising dependent systems.

## Scope
Applies to fields, topics, tables, datasets, versions, metrics, and other shared contract elements.

## MUST
- Deprecation MUST include a replacement or explicit retirement rationale, owner, effective date, and removal date.
- Known consumers MUST receive sufficient notice and migration guidance before removal.
- Removal MUST be blocked while approved active consumers still depend on the deprecated element unless explicit risk approval exists.
- Usage evidence MUST be reviewed before final deletion.

## MUST NOT
- Deprecated elements MUST NOT disappear solely because no recent developer recalls a consumer.
- Documentation marking an element deprecated MUST NOT be treated as proof that migration is complete.

## SHOULD
- Deprecation warnings SHOULD be machine-visible where the platform supports them.
- Owners SHOULD track migration progress and unresolved consumers.

## Exceptions
Emergency retirement requires documented security, legal, or operational justification, affected-consumer assessment, mitigation, and approval.

## Verification
Inspect usage telemetry, lineage, consumer registrations, migration tickets, contract metadata, and removal approvals before deletion.
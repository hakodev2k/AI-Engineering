# Deprecation and Retention Rules

## Purpose
Retire schemas safely while preserving required compatibility, replay, audit, and historical decoding.

## Scope
Deprecated subjects, old versions, retention windows, archival, deletion, and consumer migration.

## MUST
- Deprecation MUST identify active consumers and replacement guidance.
- Retention periods MUST account for message retention, replay, audit, and support requirements.
- Schema deletion MUST require evidence that retained data no longer depends on the schema.
- Deprecation status and sunset date MUST be discoverable.
- Permanent deletion of production schemas MUST require explicit human approval.

## MUST NOT
- MUST NOT delete schemas merely because no current producer uses them.
- MUST NOT remove historical versions needed to decode retained events.
- MUST NOT silently reuse retired identifiers for unrelated contracts.

## SHOULD
- Track migration progress for deprecated schemas.
- Prefer archival over irreversible deletion when storage cost is low and audit value remains.

## Exceptions
Accelerated retirement requires security, compliance, or incident justification plus documented impact and approval.

## Verification
Review usage telemetry, retained-message windows, migration status, archive records, and deletion approvals.
# Versioning and Deprecation Rules

## Purpose
Allow feature evolution without accidental breakage of training pipelines or online consumers.

## Scope
Feature versions, aliases, migrations, deprecations, and sunset policy.

## MUST
- Breaking semantic or schema changes MUST create a new version or equivalent compatibility boundary.
- Active consumers MUST be discoverable before deprecation.
- Deprecation MUST define replacement guidance and a sunset date.
- Old versions MUST remain available for the documented migration window unless risk requires earlier removal.
- Removal of production features MUST be verified against consumer usage.

## MUST NOT
- MUST NOT repurpose a deprecated feature name for unrelated semantics.
- MUST NOT remove a feature solely because catalog ownership is unclear.
- MUST NOT force simultaneous consumer migration without an approved coordinated plan.

## SHOULD
- Minimize long-lived duplicate versions by tracking migration progress.
- Prefer compatibility adapters for low-risk transitions.

## Exceptions
Accelerated removal requires security, compliance, or operational justification and explicit approval.

## Verification
Review catalog versions, consumer lineage, usage telemetry, migration tickets, and removal checks.
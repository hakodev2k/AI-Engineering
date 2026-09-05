# Source Contract Rules

## Purpose
Protect analytical systems from silent upstream data changes.

## Scope
Applies to source tables, event streams, files, APIs, replicated databases, and ingestion interfaces consumed by analytics.

## MUST
- Critical sources MUST have documented expected fields, types, keys, freshness, and ownership.
- Breaking source changes MUST be detected before dependent analytical outputs silently change.
- Required source fields MUST have explicit nullability and semantic expectations.
- Source freshness and availability assumptions MUST be measurable.
- Upstream changes affecting business meaning MUST trigger downstream impact review.

## MUST NOT
- MUST NOT assume source schemas are stable merely because ingestion succeeds.
- MUST NOT silently coerce incompatible source values when doing so can change meaning.
- MUST NOT treat missing critical source data as valid zero values unless that behavior is explicitly defined.

## SHOULD
- Use automated source contracts or schema checks where supported.
- Maintain named owners for critical upstream datasets.

## Exceptions
Exceptions require documented risk, fallback behavior, monitoring, and owner approval.

## Verification
Inspect source definitions, schema checks, freshness monitors, ownership metadata, and change alerts.
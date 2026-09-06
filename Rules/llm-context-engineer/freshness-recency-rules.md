# Freshness and Recency Rules

## Purpose
Keep time-sensitive context current without confusing recency with authority.

## Scope
Timestamps, version dates, cache age, stale content, and update checks.

## MUST
- Time-sensitive context MUST carry a source timestamp or version when available.
- Freshness requirements MUST be defined for sources whose age affects correctness.
- Stale context MUST be identified or refreshed before use when requirements demand current data.
- Conflicting newer and older evidence MUST retain their dates for review.

## MUST NOT
- MUST NOT treat undated content as current by default.
- MUST NOT prefer newer content automatically when an older source is authoritative.
- MUST NOT hide stale cache entries behind current request timestamps.

## SHOULD
- Prefer source-native update metadata over ingestion time.
- Track cache age and refresh outcomes for important sources.

## Exceptions
Exceptions require documented tolerance for stale data.

## Verification
Inspect timestamps, cache metadata, stale-data tests, and time-sensitive evaluations.
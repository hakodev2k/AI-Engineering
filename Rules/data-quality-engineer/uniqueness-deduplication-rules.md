# Uniqueness and Deduplication Rules
## Purpose
Protect entity identity and prevent duplicate facts.
## Scope
Keys, duplicate detection, merge logic, and replay effects.
## MUST
- Uniqueness expectations MUST be defined at the correct business grain.
- Deduplication logic MUST be deterministic and preserve auditability of discarded or merged records.
- Event pipelines MUST account for retries and replay duplicates.
## MUST NOT
- MUST NOT deduplicate solely by arbitrary row order when business identity exists.
- MUST NOT delete suspected duplicates irreversibly without approved evidence for critical data.
## SHOULD
- Duplicate rates SHOULD be monitored by source and key dimensions.
## Exceptions
Probabilistic entity matching requires documented thresholds and false-match evaluation.
## Verification
Run key uniqueness tests, replay tests, duplicate profiling, and lineage review.
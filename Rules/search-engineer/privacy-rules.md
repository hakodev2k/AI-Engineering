# Search Privacy

## Purpose
Minimize privacy risk in queries, logs, indexes, analytics, and personalization.

## Scope
Query data, click data, user profiles, indexed personal data, retention, and diagnostics.

## MUST
- Classify query and behavioral data before collection because queries may contain sensitive information.
- Collect and retain only data required for defined search purposes.
- Apply approved deletion and retention requirements to indexes, caches, logs, and derived search datasets.
- De-identify or restrict access to evaluation and analytics datasets containing user data.

## MUST NOT
- Copy production queries into broadly accessible test fixtures.
- Persist sensitive raw queries indefinitely by default.
- Use behavioral data for new purposes without applicable governance review.

## SHOULD
- Prefer aggregation, sampling, redaction, or privacy-preserving representations when raw data is unnecessary.

## Exceptions
Exceptions require purpose, lawful/governance basis where applicable, retention, access controls, and approval.

## Verification
Inspect schemas, logging configuration, retention jobs, deletion tests, dataset permissions, and data-flow documentation.
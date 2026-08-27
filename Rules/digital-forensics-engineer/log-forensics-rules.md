# Log Forensics Rules

## Purpose
Use logs as scoped, potentially incomplete evidence rather than unquestioned ground truth.

## Scope
Applies to operating-system, application, identity, audit, security, database, and infrastructure logs.

## MUST
- Log analysis MUST document source, retention, collection method, timezone, and known filtering.
- Analysts MUST assess whether logging was enabled and whether records can be altered or dropped.
- Parsed fields used in conclusions MUST be traceable to original records.
- Duplicate, delayed, replayed, and out-of-order events MUST be considered where relevant.
- Gaps MUST be reported when they affect conclusions.

## MUST NOT
- MUST NOT claim an event did not occur solely because a log lacks it unless coverage is proven.
- MUST NOT discard malformed records without documenting their existence.
- MUST NOT overwrite original exported logs during normalization.

## SHOULD
- Preserve raw exports alongside normalized datasets.
- Correlate critical events with independent telemetry.

## Exceptions
If only transformed logs are available, document transformation provenance and unavailable source evidence.

## Verification
Compare raw and parsed records, inspect retention/configuration, test queries, validate timezone handling, and reconcile event counts and gaps.
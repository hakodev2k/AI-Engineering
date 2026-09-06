# Temporal Validity Rules

## Purpose
Prevent obsolete memory from being treated as current truth.

## Scope
Event time, observation time, effective periods, expiry, supersession, and recency.

## MUST
- Time-sensitive memories MUST distinguish when information was observed from when it became effective.
- Superseded memories MUST remain traceable when auditability requires history.
- Expiry rules MUST reflect semantic validity, not arbitrary storage convenience.
- Retrieval MUST exclude expired or superseded memories unless historical context is explicitly requested.

## MUST NOT
- MUST NOT use insertion time as the sole truth timestamp when source time exists.
- MUST NOT silently revive expired memory through reindexing or migration.
- MUST NOT resolve conflicting temporal records without explicit precedence rules.

## SHOULD
- Model validity intervals for facts that change over time.
- Use recency as one ranking signal, not automatic proof of correctness.

## Exceptions
Exceptions require documented temporal ambiguity, fallback behavior, and reviewer approval.

## Verification
Inspect timestamp fields, expiry tests, historical queries, supersession logic, and retrieval traces.
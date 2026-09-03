# Deduplication Rules

## Purpose
Prevent duplicate records from corrupting counts, balances, joins, and downstream decisions.

## Scope
Ingestion, CDC, event streams, batch loads, joins, merges, and replay processing.

## MUST
- Define what constitutes a duplicate using business-stable identity or explicit matching criteria.
- Preserve enough metadata to explain why records were classified as duplicates.
- Test duplicate handling under retry, replay, out-of-order, and partial-delivery scenarios.
- Reconcile deduplicated counts against source and expected processing volume.

## MUST NOT
- Deduplicate solely by full-row equality when business identity differs.
- Drop records on ambiguous duplicate criteria without measurable evidence and review.
- Assume transport-level uniqueness guarantees business-level uniqueness.

## SHOULD
- Prefer deterministic tie-breaking and survivorship rules.
- Track duplicate rates as an operational signal.

## Exceptions
Probabilistic or heuristic deduplication requires documented error trade-offs, validation evidence, monitoring, and approval where business impact is material.

## Verification
Use duplicate-injection tests, key analysis, reconciliation queries, sampled survivor review, and duplicate-rate monitoring.
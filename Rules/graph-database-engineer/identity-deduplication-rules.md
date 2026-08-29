# Identity and Deduplication Rules

## Purpose
Prevent duplicate vertices/nodes and incorrect entity merges.

## Scope
Entity resolution, identifiers, matching, deduplication, and merge operations.

## MUST
- Define authoritative identifiers and their namespaces before ingestion.
- Make upsert matching deterministic and concurrency-safe.
- Preserve provenance for probabilistic or heuristic entity resolution.
- Require reviewable evidence before merging identities when a false merge can corrupt business meaning.

## MUST NOT
- Match entities using display names alone when collisions are possible.
- Perform irreversible bulk merges without a tested recovery strategy.
- Reuse identifiers across incompatible entity namespaces without explicit qualification.

## SHOULD
- Separate deterministic identity rules from probabilistic similarity rules.
- Track merge confidence and source evidence when identity is inferred.

## Exceptions
Heuristic matching requires documented thresholds, false-positive/false-negative analysis, rollback or correction procedure, and approval appropriate to impact.

## Verification
Run duplicate and collision audits, concurrent upsert tests, sampled entity-resolution reviews, and post-import counts. Verify that merges preserve provenance and can be traced to source records.
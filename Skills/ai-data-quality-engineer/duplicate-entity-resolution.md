# Duplicate and Entity Resolution

## Purpose
Detect duplicate records and resolve entity identity so AI datasets do not overweight repeated examples or fragment the same entity.

## When to use
Use for merged sources, customer/product/entity datasets, deduplication before training, or suspiciously repeated examples.

## Inputs
Records, candidate identifiers, source metadata, matching rules, timestamps, canonical entity definitions.

## Preconditions
The business meaning of identity and acceptable merge error are understood.

## Context to inspect
Natural keys, surrogate keys, source-specific IDs, normalization rules, merge history, fuzzy matching, temporal identity changes.

## Core knowledge
False merges and missed duplicates have different costs. Exact-key deduplication is insufficient when identifiers are missing or source-specific. Temporal changes can make two similar records legitimately distinct.

## Procedure
1. Define the entity and uniqueness boundary.
2. Profile exact duplicate rates.
3. Normalize candidate identity fields.
4. Generate candidate record pairs efficiently.
5. Score matches using deterministic and probabilistic signals.
6. Set match, review, and non-match thresholds.
7. Preserve source lineage for merged entities.
8. Evaluate false-merge and missed-duplicate rates on labeled samples.
9. Apply deduplication before split generation when leakage risk exists.
10. Monitor duplicate rates after source changes.

## Decision points
Use deterministic matching for strong identifiers; use probabilistic or fuzzy matching when identity is noisy. Favor conservative merging when false merges are costly.

## Common failure patterns
Deduplicating after train/test split, ignoring aliases, merging on mutable attributes, and losing original source records.

## Verification
Sampled matches are reviewed, duplicate metrics improve, and downstream dataset cardinality and split integrity remain correct.

## Expected output
Entity-resolution rules, evaluation results, canonical mapping, and monitoring thresholds.

## Stop conditions
Stop when identity semantics or acceptable merge risk are unresolved.
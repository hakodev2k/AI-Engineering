# Entity Identity Rules

## Purpose
Ensure graph nodes represent stable, unambiguous real-world or logical entities.

## Scope
Identifiers, canonicalization, duplicate detection, aliasing, merging, splitting, and identity resolution.

## MUST
- Each entity type MUST define its identity strategy and authoritative identifier source.
- Identity resolution MUST preserve provenance for matched and merged records.
- Merge and split operations MUST be auditable and reversible where practical.
- Confidence-based entity resolution MUST define thresholds and review behavior for ambiguous matches.

## MUST NOT
- MUST NOT use mutable display fields as sole identity keys when stable identifiers exist.
- MUST NOT merge entities solely because names or labels are similar.
- MUST NOT discard source identifiers during canonicalization.

## SHOULD
- Prefer deterministic matching for high-confidence identifiers before probabilistic matching.
- Maintain aliases separately from canonical identity.

## Exceptions
Exceptions require documented collision risk, matching evidence, and owner approval.

## Verification
Review identifier contracts, duplicate tests, merge histories, sampled resolution decisions, and collision metrics.
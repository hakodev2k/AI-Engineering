# Identity and Entity Resolution

## Purpose
Resolve records from heterogeneous sources into trustworthy graph entities without collapsing distinct real-world objects or creating uncontrolled duplication.

## When to use
Use during multi-source ingestion, master-data integration, deduplication, graph consolidation, or when AI applications require stable entity identity.

## Inputs
Source records, candidate identifiers, matching attributes, provenance, business rules, known duplicate/non-duplicate examples.

## Preconditions
Define which identifiers are authoritative and which attributes may legitimately change over time.

## Context to inspect
Source keys, normalization logic, existing entity IDs, merge history, blocking rules, similarity models, manual-review queues, downstream references.

## Core knowledge
Entity resolution combines deterministic keys, probabilistic matching, blocking, normalization, temporal reasoning, and provenance. False merges are usually more damaging than duplicates because they corrupt neighborhoods and downstream reasoning.

## Procedure
1. Profile identifiers and attribute quality by source.
2. Normalize comparable fields conservatively.
3. Define deterministic matches where semantics guarantee identity.
4. Design blocking rules for probabilistic candidates.
5. Compute similarity using domain-relevant features.
6. Calibrate merge, reject, and review thresholds.
7. Preserve source lineage and pre-merge identifiers.
8. Make merges reversible.
9. Evaluate precision/recall on labeled pairs.
10. Monitor drift and repeated merge/split behavior.

## Decision points
Prefer precision when a false merge can contaminate sensitive or high-value graph regions. Use human review for ambiguous, high-impact entities.

## Common failure patterns
Using names as primary identity, irreversible merges, ignoring temporal changes, training on biased duplicate sets, and failing to distinguish household/organization/person identities.

## Verification
Measure pairwise precision/recall, inspect cluster consistency, validate reversible merges, and confirm downstream queries retain referential integrity.

## Expected output
Resolution rules, thresholds, evaluation evidence, merge lineage, and exception-handling process.

## Stop conditions
Escalate when identity policy is legally sensitive, authoritative sources conflict, or merge reversibility cannot be guaranteed.
# Reference and Master Data Quality

## Purpose
Protect shared identifiers, classifications, hierarchies, and mastered entities whose defects propagate across many systems.

## When to use
Use for customer/product masters, code sets, taxonomies, geographic references, organizational hierarchies, and shared dimensions.

## Inputs
Authoritative sources, matching rules, survivorship policy, identifiers, hierarchies, stewardship workflow, and consumer requirements.

## Preconditions
Establish authority and stewardship for contested values.

## Context to inspect
Inspect source precedence, duplicate entities, identifier reuse, effective dates, hierarchy cycles, merge/split history, and downstream joins.

## Core knowledge
Master data quality combines uniqueness, identity resolution, consistency, referential integrity, temporal validity, and governance. Incorrect merges can be more damaging than duplicates.

## Procedure
1. Define mastered entity and business grain.
2. Inventory sources and authority by attribute.
3. Validate identifiers and lifecycle rules.
4. Profile duplicates and conflicting values.
5. Define deterministic matching before probabilistic matching.
6. Establish survivorship and exception policy.
7. Validate hierarchy integrity and effective dates.
8. Record merges, splits, and lineage audibly.
9. Publish reference changes with compatibility controls.
10. Monitor orphan references and match confidence.
11. Route ambiguous cases to stewardship.

## Decision points
Prefer stable source identifiers over fuzzy matching. Automate high-confidence matches and review ambiguous ones. Preserve historical identity when consumers need temporal correctness.

## Common failure patterns
Over-aggressive entity merges; mutable identifiers; circular hierarchies; no effective dating; silent code reuse; treating one source as authoritative for every attribute.

## Verification
Sample matched entities, test known duplicates and false-match risks, validate hierarchy constraints, and reconcile downstream reference coverage.

## Expected output
Controlled master/reference data with authority rules, identity controls, stewardship, temporal semantics, and quality metrics.

## Stop conditions
Escalate ambiguous identity decisions with material impact, conflicting authoritative sources, or merges that cannot be safely reversed.
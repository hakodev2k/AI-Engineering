# Reference and Master Data Governance

## Purpose
Govern shared master and reference data so identifiers, hierarchies, codes, and golden records remain consistent across systems.

## When to use
Use when duplicate entities, conflicting codes, hierarchy drift, or inconsistent shared dimensions cause operational/reporting failures.

## Inputs
Source systems, entity models, matching rules, code sets, hierarchies, consumers, change workflows, ownership.

## Context to inspect
Inspect authoritative sources, duplicate patterns, survivorship rules, synchronization, downstream dependencies, and external standards.

## Core knowledge
Master data represents core business entities; reference data constrains permitted values. Governance must define authority, identity, matching, survivorship, lifecycle, hierarchy, and distribution.

## Procedure
1. Identify shared entities/code sets with material inconsistency.
2. Define canonical semantics and identifiers.
3. Determine authoritative source or golden-record strategy.
4. Define match, merge, survivorship, and unmerge rules where needed.
5. Assign business ownership and stewardship.
6. Govern hierarchy and code-set changes.
7. Define synchronization contracts and latency expectations.
8. Preserve history and effective dating when required.
9. Establish exception and duplicate-resolution workflows.
10. Monitor drift, duplicate rate, unresolved matches, and downstream adoption.

## Decision points
Use centralized mastering when enterprise consistency dominates; registry/coexistence when source autonomy is necessary. Never merge ambiguous identities merely to improve duplicate metrics.

## Common failure patterns
Golden record without business authority, opaque matching, irreversible bad merges, inconsistent effective dates, uncontrolled local code lists, and missing downstream change notification.

## Verification
Test create/change/merge/split/retire scenarios and confirm consumers receive consistent identifiers and values with traceable provenance.

## Expected output
Governance model for canonical entities/reference sets, authority, matching, lifecycle, distribution, and controls.

## Stop conditions
Escalate identity ambiguity with material impact, legal restrictions on consolidation, or unresolved authoritative-source conflicts.
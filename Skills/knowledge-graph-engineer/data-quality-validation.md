# Data Quality Validation

## Purpose
Define and enforce graph-specific quality controls for identity, completeness, consistency, semantic validity, topology, and freshness.

## When to use
Use when onboarding new sources, changing mappings, investigating graph defects, or establishing production quality gates.

## Inputs
Graph model, constraints, source contracts, quality thresholds, sample data, known defects, and downstream criticality.

## Preconditions
Define which quality dimensions are blocking versus informational and who owns remediation.

## Context to inspect
Duplicate identities, orphan nodes, invalid edge types, cardinality violations, stale facts, schema drift, impossible cycles, and conflicting assertions.

## Core knowledge
Graph quality extends beyond column validation. Structural defects such as disconnected entities, impossible relationships, runaway degree, or identity collisions can invalidate downstream reasoning even when individual records look valid.

## Procedure
1. Translate semantic invariants into executable checks.
2. Validate identifiers, datatypes, required properties, and relation types.
3. Detect duplicate canonical entities and orphan references.
4. Check cardinality and topology invariants.
5. Measure freshness and source coverage.
6. Validate controlled vocabularies and ontology conformance.
7. Detect statistically abnormal degree or relationship distributions.
8. Classify violations by severity.
9. Quarantine unsafe mutations rather than silently accepting them.
10. Trend quality metrics by source and release.
11. Add regression fixtures for recurring defects.

## Decision points
Block ingestion for violations that corrupt identity or critical invariants; warn for non-critical completeness gaps. Use statistical anomaly checks as signals, not automatic proof of invalidity.

## Common failure patterns
Checking only nulls; accepting duplicate identifiers; no source-level quality attribution; hard-coded thresholds with no baseline; and quality checks that run after irreversible writes.

## Verification
Inject known bad records, confirm expected failures, compare quality metrics before/after changes, and validate critical graph invariants on production-like snapshots.

## Expected output
Executable quality rules, severity thresholds, dashboards/reports, quarantines, and remediation ownership.

## Stop conditions
Stop when quality rules require unresolved business semantics or remediation would delete/merge production knowledge without approval.
# Metadata and Taxonomy Design

## Purpose
Create metadata and classification structures that improve filtering, retrieval, governance, analytics, and ownership without becoming an unmaintainable catalog.

## When to use
Use when retrieval depends on domain, region, product, audience, lifecycle, sensitivity, or authority filters, or when existing tags are inconsistent.

## Inputs
Representative corpus, user queries, business vocabulary, existing tags, ownership rules, access policies, lifecycle states, and search requirements.

## Context to inspect
Inspect current metadata completeness, vocabulary collisions, source-native fields, search facets, query logs, downstream filters, and governance policies.

## Core knowledge
Metadata should serve explicit decisions. Controlled vocabularies improve consistency; free-form tags improve flexibility. Hierarchies encode broader/narrower concepts but can become brittle. Derived metadata must retain confidence and derivation provenance.

## Procedure
1. Identify retrieval and governance decisions that require metadata.
2. Reuse trustworthy source fields before inventing new ones.
3. Define required, optional, derived, and prohibited fields.
4. Specify field types, allowed values, cardinality, defaults, and null semantics.
5. Build controlled vocabularies for high-value stable concepts.
6. Define synonym and alias handling.
7. Add ownership, authority, sensitivity, lifecycle, locale, and temporal fields where relevant.
8. Define automated enrichment rules and confidence thresholds.
9. Version taxonomy changes and migration behavior.
10. Test the scheme on heterogeneous samples and real queries.

## Decision points
Use a strict taxonomy when filtering or policy enforcement requires determinism; use semantic labels when categories evolve rapidly. Prefer fewer high-quality facets over many sparse fields.

## Common failure patterns
Taxonomy designed from org charts, uncontrolled synonyms, mandatory fields nobody can populate, mixing security labels with topical tags, and changing values without migrations.

## Verification
Measure metadata completeness and consistency, run facet-based retrieval tests, and confirm that taxonomy changes preserve or intentionally migrate existing content.

## Expected output
A versioned metadata schema, controlled vocabularies, derivation rules, ownership, and migration guidance.

## Stop conditions
Stop when key business concepts have unresolved definitions, policy labels lack authoritative owners, or proposed metadata cannot be populated reliably.
# Synonyms and Domain Taxonomy

## Purpose
Manage domain vocabulary, synonyms, aliases, acronyms, and taxonomic relationships so recall improves without collapsing distinct meanings.

## When to use
Use when users and content use different terminology, abbreviations, product aliases, or hierarchical domain concepts.

## Inputs
Query logs, content vocabulary, domain taxonomy, zero-result examples, judgments, locale data, existing synonym rules.

## Context to inspect
Analyzer-time/query-time expansion, one-way versus equivalent mappings, taxonomy ownership, rule versioning, and observed false positives.

## Core knowledge
Synonymy is contextual. Equivalent expansion is stronger than directional rewrite and can reduce precision. Taxonomies express broader/narrower relationships that should not automatically be treated as synonyms.

## Procedure
1. Mine candidate terms from queries, content, support data, and domain experts.
2. Classify aliases, true synonyms, abbreviations, broader/narrower concepts, and related terms separately.
3. Prefer directional mappings when equivalence is uncertain.
4. Define locale and domain scope.
5. Test tokenization interactions before adding rules.
6. Evaluate candidate rules on judged queries and known counterexamples.
7. Version and review rules like code.
8. Deploy through controlled query-time expansion when rapid rollback matters.
9. Monitor zero-result and precision regressions.
10. Retire stale vocabulary deliberately.

## Decision points
Use index-time expansion only when operational simplicity outweighs reindex cost; query-time expansion for agility and controlled context. Use taxonomy boosts rather than equivalence for broader/narrower concepts.

## Common failure patterns
Symmetric expansion of asymmetric terms, global rules for local vocabulary, synonym loops, unowned rule files, and adding synonyms solely from one failed query.

## Verification
Run regression queries, inspect expanded forms, compare recall/precision, and validate counterexamples where terms must remain distinct.

## Expected output
Versioned vocabulary rules, relationship types, scope, evaluation evidence, owners, and rollback procedure.

## Stop conditions
Stop when term meaning is disputed, expansion causes material false positives, or taxonomy ownership is unclear.
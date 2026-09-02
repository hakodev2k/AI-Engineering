# Entity Resolution

## Purpose
Resolve records from heterogeneous sources into stable real-world identities while controlling false merges, missed matches, and auditability risk.

## When to use
Use when ingesting duplicate entities, reconciling customer/product/person/organization records, or building canonical graph nodes across sources.

## Inputs
Source records, identifiers, candidate features, matching rules, labeled examples, source reliability, and merge/split requirements.

## Preconditions
Define the business cost of false positives versus false negatives and establish whether merges must be reversible.

## Context to inspect
Source identifiers, normalization rules, data quality, historical merges, collision rates, privacy constraints, and downstream dependence on canonical IDs.

## Core knowledge
Entity resolution combines deterministic keys, normalization, blocking, probabilistic or ML matching, and survivorship rules. Identity is a governed decision, not just a similarity score.

## Procedure
1. Define entity boundaries and canonical identity semantics.
2. Inventory strong identifiers and weak attributes.
3. Normalize fields without destroying meaningful distinctions.
4. Build candidate-generation/blocking rules.
5. Establish deterministic matches first.
6. Score ambiguous candidates with explainable features.
7. Set thresholds based on business error costs.
8. Define survivorship and source precedence.
9. Record evidence for each merge.
10. Support split/unmerge workflows.
11. Evaluate on labeled and adversarial examples.
12. Monitor drift in match rates and collision patterns.

## Decision points
Use strict deterministic matching for high-risk identities; probabilistic matching for noisy domains with review paths. Human review is appropriate around uncertain thresholds or regulated decisions.

## Common failure patterns
Name-only matching; irreversible merges; treating missing values as disagreement; inconsistent normalization; biased training labels; and silently changing canonical identifiers.

## Verification
Measure precision, recall, false-merge rate, false-split rate, review volume, and stability on historical replay. Verify merge provenance and reversibility.

## Expected output
Canonical identity rules, matching pipeline, thresholds, provenance, quality metrics, and exception workflow.

## Stop conditions
Stop when legal identity requirements are unclear, ground truth is insufficient for high-risk matching, or merges cannot be safely reversed.
# Data Quality and Validation

## Purpose
Establish trustworthy training and inference data by detecting schema, semantic and statistical defects before they contaminate models.

## When to use
Use when onboarding a dataset, changing a pipeline, retraining, or investigating model degradation.

## Inputs
Schemas, samples, data contracts, lineage, feature definitions, label definitions, historical distributions and quality incidents.

## Context to inspect
Producers, transformations, timestamps, joins, null semantics, units, categorical vocabularies, retention and access controls.

## Core knowledge
Syntactic validity is insufficient: ML data must also be semantically correct, temporally valid and representative. Silent upstream changes are a major production risk.

## Procedure
1. Trace each critical field to its source.
2. Define schema and semantic invariants.
3. Profile missingness, ranges, cardinality, duplicates and outliers.
4. Validate timestamps and event ordering.
5. Check join coverage and row multiplication.
6. Compare train, validation and recent production distributions.
7. Validate labels independently from features.
8. Encode critical checks in automated pipeline gates.
9. Quarantine invalid partitions rather than silently coercing them.
10. Record owners and remediation paths for failed checks.

## Decision points
Use hard failures for contract violations that invalidate learning; warnings for tolerable statistical drift pending investigation. Prefer source correction over downstream patching.

## Common failure patterns
Treating null as zero; timezone mistakes; duplicated entities; unit changes; stale snapshots; survivorship bias; silent category expansion; validating only a small sample.

## Verification
Run checks against known-good and intentionally corrupted fixtures; confirm failures block or quarantine data as designed; compare quality metrics across recent partitions.

## Expected output
Versioned validation rules, quality report, identified defects and remediation evidence.

## Stop conditions
Stop training if critical invariants fail, lineage is unknown for important features, or label integrity cannot be established.
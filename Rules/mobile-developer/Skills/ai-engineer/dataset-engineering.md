# AI Dataset Engineering

## Purpose
Create trustworthy datasets for evaluation, fine-tuning, retrieval validation, and safety testing with clear provenance and coverage.

## When to use
Use whenever AI behavior will be measured or trained from examples.

## Inputs
Production samples, domain sources, labels/rubrics, privacy rules, task taxonomy, historical incidents.

## Preconditions
Define dataset purpose and prevent evaluation/training leakage.

## Context to inspect
Source rights, class distribution, edge cases, duplicate rate, temporal coverage, annotator guidance, sensitive data.

## Core knowledge
Dataset quality depends on representativeness, provenance, labeling consistency, independence, and slice coverage. Large datasets can still be misleading if duplicated, leaked, or distributionally narrow.

## Procedure
1. Define task taxonomy and important risk slices.
2. Select sources with clear provenance and permitted usage.
3. Sample realistic normal, edge, adversarial, and failure cases.
4. Remove duplicates and near-duplicates where they bias results.
5. Redact or exclude unnecessary sensitive data.
6. Create annotation guidelines and disagreement rules.
7. Separate train, validation, and holdout sets using leakage-resistant boundaries.
8. Version examples, labels, metadata, and transformations.
9. Measure slice balance and missing coverage.
10. Review dataset drift as production behavior changes.

## Decision points
Prefer real data for realism, synthetic data for targeted rare cases, and combine them only with clear labels and validation. Split by user/document/time when random row splits would leak context.

## Common failure patterns
Random splits with duplicates, undocumented synthetic data, stale examples, label inconsistency, source-rights ambiguity, and only happy-path coverage.

## Verification
Run duplicate/leakage checks, annotation audits, slice reports, provenance review, and spot checks against production behavior.

## Expected output
A versioned dataset with provenance, coverage metrics, labeling rules, and safe handling controls.

## Stop conditions
Stop when data rights, privacy, or dataset purpose are unclear.
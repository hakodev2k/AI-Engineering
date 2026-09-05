# Missingness and Completeness Analysis

## Purpose
Detect and explain missing data patterns that can degrade training, evaluation, or inference behavior.

## When to use
Use for new datasets, sudden quality drops, sparse features, failed joins, or unexplained model regressions.

## Inputs
Dataset, schema, source metadata, join logic, time range, subgroup definitions, historical baselines.

## Preconditions
Missing, null, absent, defaulted, and unknown values can be distinguished.

## Context to inspect
Ingestion logic, source outages, filtering, joins, default values, feature generation, backfills, sampling, and downstream imputation.

## Core knowledge
Missingness can be random, systematic, source-induced, join-induced, or subgroup-specific. Aggregate completeness can hide concentrated gaps that bias a model.

## Procedure
1. Measure missingness by field and record.
2. Segment by time, source, tenant, and relevant subgroup.
3. Compare against historical baselines.
4. Separate true absence from ingestion or parsing failure.
5. Inspect joins and filters for dropped data.
6. Quantify downstream feature and label impact.
7. Determine whether imputation is valid for the use case.
8. Fix source or pipeline defects before masking them with defaults.
9. Add threshold-based and trend monitoring.
10. Document expected missingness where legitimate.

## Decision points
Impute only when semantics justify it. Prefer explicit unknown states over fabricated values when uncertainty matters.

## Common failure patterns
Using a single global completeness percentage, silently filling nulls, ignoring subgroup gaps, and blaming sources before checking joins.

## Verification
Root cause is reproduced, corrected data shows expected completeness, and downstream tests confirm no hidden defaulting regression.

## Expected output
A missingness profile, root-cause assessment, remediation, and monitoring rule.

## Stop conditions
Stop when missingness semantics cannot be established from source owners or domain documentation.
# Data Profiling

## Purpose
Systematically characterize a dataset before defining controls, migrations, transformations, or remediation so decisions are based on evidence rather than schema assumptions.

## When to use
Use for unfamiliar datasets, new sources, migrations, incident investigation, and baseline creation.

## Inputs
Representative data, schema, partitions, timestamps, source documentation, expected semantics, and consumer requirements.

## Preconditions
Use privacy-safe access and samples that preserve important distributions and edge cases.

## Context to inspect
Inspect row counts, types, nullability, cardinality, distributions, ranges, patterns, duplicates, referential relationships, temporal coverage, partitions, and schema drift history.

## Core knowledge
Declared types rarely capture semantic constraints. Profiling should distinguish structural anomalies from legitimate rare values. Sampling can hide tail problems; partition-aware and time-aware analysis reduces this risk.

## Procedure
1. Confirm dataset scope and observation window.
2. Record schema and physical partitioning.
3. Measure volume and change over time.
4. Profile null rates and empty representations.
5. Measure cardinality and duplicate behavior.
6. Calculate distributions, quantiles, ranges, and outliers.
7. Inspect categorical frequencies and rare values.
8. Test format and domain patterns.
9. Evaluate key uniqueness and relationships.
10. Compare profiles across partitions and periods.
11. Investigate suspicious findings with source owners.
12. Separate confirmed defects from valid exceptions.
13. Persist a reproducible baseline and candidate rules.

## Decision points
Use full scans for critical invariants when affordable; otherwise use stratified or partition-aware sampling. Treat statistical outliers as investigation signals unless semantics prove invalidity. Compare against historical baselines when seasonality matters.

## Common failure patterns
Profiling only a tiny random sample; assuming null and empty mean the same thing; interpreting outliers as errors automatically; ignoring partition skew; failing to preserve query definitions; profiling sensitive columns unnecessarily.

## Verification
Re-run profiling reproducibly, reconcile key counts with source systems, validate suspicious cases with domain evidence, and confirm candidate rules do not reject known-valid examples.

## Expected output
A reproducible profile containing distributions, anomalies, relationships, temporal behavior, confidence notes, and candidate quality controls.

## Stop conditions
Stop when data access violates policy, the sample is demonstrably unrepresentative, semantics cannot be established, or profiling queries risk unacceptable production load.
# Data Quality Regression Testing

## Purpose
Prevent data pipeline changes from silently degrading AI dataset semantics, distributions, or downstream model inputs.

## When to use
Use for transformation refactors, parser changes, schema migrations, feature engineering changes, source upgrades, and dependency updates.

## Inputs
Current pipeline, proposed changes, representative datasets, historical baselines, quality rules, expected changes, downstream consumers.

## Preconditions
A known-good baseline or expected-output specification exists.

## Context to inspect
Transformation code, configuration, schemas, feature definitions, join logic, parsing, dataset snapshots, and consumer assumptions.

## Core knowledge
Regression tests should cover structural invariants and behavior-level properties. Exact row equality is often too strict for legitimate changes, while aggregate checks alone may miss damaging record-level defects.

## Procedure
1. Define which outputs are expected to remain stable.
2. Select representative historical and edge-case fixtures.
3. Run old and new pipelines on identical inputs.
4. Compare schemas, counts, keys, missingness, distributions, and critical derived values.
5. Inspect record-level differences for important fields.
6. Separate intentional changes from regressions.
7. Measure downstream feature and model impact when relevant.
8. Encode accepted invariants as automated tests.
9. Add fixtures for newly discovered failure modes.
10. Require regression evidence before release.

## Decision points
Use exact comparisons for deterministic contracts and tolerance-based comparisons for statistical outputs. Require downstream model checks when data semantics change materially.

## Common failure patterns
Testing only successful execution, using tiny happy-path fixtures, updating expected outputs without review, and ignoring distribution shifts introduced by refactors.

## Verification
The change passes structural and semantic regression checks, and all intentional differences are documented and reviewed.

## Expected output
A regression test suite, comparison report, and evidence that the change preserves required data behavior.

## Stop conditions
Stop when no trustworthy baseline exists or observed differences cannot be explained confidently.
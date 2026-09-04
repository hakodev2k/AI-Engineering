# Evaluation Telemetry Rules

## Purpose
Make offline and online AI evaluations reproducible, comparable, and diagnosable.

## Scope
Applies to evaluation runs, datasets, rubrics, judges, scoring pipelines, and experiment metadata.

## MUST
- Every evaluation result MUST be linked to dataset version, evaluator version, model version, prompt/configuration version, and run identifier.
- Evaluation pipelines MUST record failed, skipped, and invalid examples separately from scored examples.
- Aggregate scores MUST preserve enough per-example evidence to diagnose regressions.
- Comparison reports MUST use the same metric semantics and clearly identify changed evaluation conditions.
- Evaluation telemetry MUST capture sampling and filtering criteria.

## MUST NOT
- Failed examples MUST NOT be silently dropped from denominators.
- Results from incompatible dataset or rubric versions MUST NOT be compared as if directly equivalent.
- Benchmark improvements MUST NOT be claimed from cherry-picked subsets without explicit disclosure.

## SHOULD
- Persist distributions and confidence intervals where sample sizes support them.
- Correlate online quality incidents with representative offline cases.

## Exceptions
Ad hoc exploratory evaluations may use lighter metadata only when clearly labeled non-authoritative and not used for release gates.

## Verification
Inspect evaluation manifests, run records, score calculations, failed-case accounting, dataset versions, and repeatability of a sampled historical run.
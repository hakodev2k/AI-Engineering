# Speech Model Evaluation

## Purpose
Create evaluation that predicts real speech-system quality rather than a single benchmark score.

## When to use
Use before releases, during model comparison, after data changes, or when defining acceptance gates.

## Inputs
Frozen datasets, task metrics, product requirements, cohort metadata, baselines, latency/cost measurements.

## Context to inspect
Inspect split provenance, metric implementation, normalization, cohort coverage, confidence intervals, and prior release gates.

## Core knowledge
Metrics must match the task: WER/CER, DER, EER/FAR/FRR, event F1, MOS/preference, intelligibility, latency and resource metrics. Statistical uncertainty matters for small deltas.

## Procedure
1. Define primary and guardrail metrics.
2. Freeze evaluation manifests and preprocessing.
3. Validate metric implementations with fixtures.
4. Evaluate aggregate and critical cohorts.
5. Compute uncertainty or paired significance for comparisons.
6. Inspect qualitative failures.
7. Include latency, memory, and cost gates.
8. Record reproducible model/data/config identifiers.

## Decision points
Use human evaluation when perceptual quality is central. Prefer paired tests when comparing outputs on the same samples.

## Common failure patterns
Test contamination, normalization drift, cherry-picked cohorts, statistically meaningless tiny gains, and quality-only evaluation ignoring serving cost.

## Verification
A second run from recorded artifacts must reproduce results within defined tolerance.

## Expected output
A release-grade evaluation report and machine-checkable acceptance decision.

## Stop conditions
Stop when evaluation data is contaminated, metrics are invalid, or critical deployment cohorts are absent.
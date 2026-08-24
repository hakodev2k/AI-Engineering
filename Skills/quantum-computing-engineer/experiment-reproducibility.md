# Experiment Reproducibility

## Purpose
Make quantum experiments reproducible despite stochastic sampling, backend drift, compiler variation, and external service dependencies.

## When to use
Use for every experiment intended to support a technical decision, publication, regression claim, or production change.

## Inputs
Source revision, environment, circuit definitions, parameters, backend, calibration snapshot, seeds, shots, and analysis code.

## Preconditions
The experiment has a stable objective and explicit inputs.

## Context to inspect
SDK/provider versions, transpiler options, random seeds, optimizer initialization, backend job IDs, calibration time, raw counts, and post-processing steps.

## Core knowledge
Exact replay on live hardware may be impossible because hardware changes. Reproducibility therefore requires provenance sufficient to reconstruct the logical experiment and explain environmental differences.

## Procedure
1. Assign an immutable experiment identifier.
2. Capture source and dependency versions.
3. Persist logical and transpiled circuits.
4. Record parameters, seeds, shots, mappings, and compiler settings.
5. Snapshot backend properties/calibration where available.
6. Preserve raw counts/quasi-distributions before transformations.
7. Version post-processing and statistical analysis.
8. Record failed and cancelled jobs, not only successes.
9. Provide a simulator/reference replay path.
10. Re-run a sample from clean environment and document expected nondeterminism.

## Decision points
Store full raw artifacts for decision-critical experiments; use summarized telemetry only for routine exploratory runs when raw retention is unnecessary.

## Common failure patterns
Saving plots without raw data, undocumented transpiler defaults, missing seeds, stale notebooks, and mixing results from different calibrations.

## Verification
A second environment can reconstruct the experiment, rerun the analysis, and explain differences within stated uncertainty.

## Expected output
Experiment manifest, immutable artifacts, raw results, replay instructions, and provenance evidence.

## Stop conditions
Stop before claiming results when critical provenance is missing or transformations cannot be reconstructed.
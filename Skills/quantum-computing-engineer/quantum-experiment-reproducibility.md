# Quantum Experiment Reproducibility

## Purpose
Make quantum experiments repeatable by preserving code, parameters, seeds, compiler settings, calibration context, backend identity, and raw results.

## When to use
Use for research, benchmarking, optimization sweeps, and any result used for technical decisions.

## Inputs
Source revision, environment, backend metadata, experiment parameters, raw outputs, analysis code.

## Context to inspect
Dependency versions, random seeds, transpiler seeds, calibration timestamps, provider job IDs, and preprocessing/postprocessing steps.

## Core knowledge
Hardware is time-varying, so exact numerical repetition may be impossible; reproducibility means preserving enough context to explain differences and rerun the protocol.

## Procedure
1. Record source revision and dependency lock state.
2. Serialize all algorithm and optimizer parameters.
3. Capture random and compiler seeds.
4. Record backend, calibration snapshot, queue/execution times, and job IDs.
5. Store logical and transpiled circuits.
6. Preserve raw counts/results before mitigation or aggregation.
7. Version analysis and mitigation code.
8. Define expected variability and comparison metrics.
9. Re-run a subset to validate the reproduction package.

## Decision points
Store complete raw data for expensive or decision-critical experiments; use summarized artifacts only when raw retention is unnecessary and documented.

## Common failure patterns
Notebook-only state, missing seeds, overwritten result files, and no record of hardware calibration.

## Verification
Recreate selected figures/metrics from preserved raw artifacts in a clean environment.

## Expected output
A self-contained experiment record with provenance and replay instructions.

## Stop conditions
Stop before publishing conclusions if critical provenance is missing.
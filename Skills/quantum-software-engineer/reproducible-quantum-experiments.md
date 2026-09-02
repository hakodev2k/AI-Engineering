# Reproducible Quantum Experiments

## Purpose
Make quantum experiments repeatable enough that results can be audited, compared, and extended despite stochastic execution and hardware drift.

## When to use
Use for research studies, benchmarks, production evaluations, regression investigations, and any result that will inform engineering or scientific decisions.

## Inputs
Experiment hypothesis, code revision, circuits, parameters, seeds, backend metadata, calibration snapshot, shot count, and analysis pipeline.

## Context to inspect
Dependency lockfiles, provider/SDK versions, transpiler settings, randomness sources, backend identity, raw result storage, and analysis notebooks or scripts.

## Core knowledge
Exact hardware reproduction may be impossible because calibration changes, but experimental lineage can still be complete. Reproducibility requires preserving inputs, transformations, environment, raw outputs, and statistical analysis—not merely source code.

## Procedure
1. State the hypothesis and outcome metrics before execution.
2. Version code, configuration, circuits, and datasets.
3. Capture all random seeds and stochastic settings.
4. Record dependency and compiler versions.
5. Save logical and transpiled circuits.
6. Capture backend properties and calibration timestamp.
7. Persist raw counts or raw provider results immutably.
8. Make analysis executable from raw artifacts.
9. Repeat key experiments across runs or calibration windows.
10. Separate exploratory runs from confirmatory runs.
11. Record deviations from the planned protocol.
12. Package enough metadata for an independent rerun.

## Decision points
Use containers or locked environments when dependency drift is material. Treat hardware calibration as part of the experiment input rather than an invisible external condition.

## Common failure patterns
Saving only plots, overwriting raw results, untracked notebook state, missing transpiler seeds, undocumented parameter changes, and cherry-picking favorable runs.

## Verification
Rebuild the analysis from raw artifacts in a fresh environment and independently reproduce at least one representative experiment.

## Expected output
A versioned experiment package with hypothesis, complete lineage, raw results, executable analysis, and uncertainty notes.

## Stop conditions
Stop when critical provenance is missing, raw data has been lost, or untracked environment changes prevent defensible comparison.
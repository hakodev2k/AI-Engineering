# Experiment Tracking and Reproducibility

## Purpose
Make ML experiments attributable and reproducible by capturing code, data, parameters, environment, seeds, metrics, artifacts, and execution metadata.

## When to use
Use for training pipelines, tuning, research-to-production handoff, regression investigation, and regulated evidence. Avoid treating an experiment tracker as the sole source of raw data truth.

## Inputs
Training code, dataset identifiers, configuration, dependency lockfiles, runtime image, metrics, random seeds, artifact locations.

## Preconditions
Code and data can be uniquely versioned or fingerprinted.

## Context to inspect
Current logging conventions, tracker schema, dataset storage, environment build process, secret injection, and artifact retention.

## Core knowledge
Reproducibility requires immutable references and sufficient execution context. A metric without code/data/environment provenance is not a reliable comparison.

## Procedure
1. Define required metadata fields.
2. Capture commit and working-tree state.
3. Record immutable dataset/version identifiers.
4. Persist configuration and hyperparameters.
5. Record runtime image and dependency versions.
6. Capture seeds and nondeterminism sources.
7. Store metrics and artifacts with durable URIs.
8. Link parent/child runs for tuning.
9. Re-run a representative experiment from recorded metadata.
10. Document known nondeterministic variance.

## Decision points
Full environment snapshots vs lockfiles; raw artifacts vs references; retention duration based on audit and debugging value.

## Common failure patterns
Mutable dataset aliases, missing preprocessing versions, environment drift, secret leakage, incomparable metrics, and silently reused run names.

## Verification
A second operator can reproduce the run within an agreed tolerance using recorded metadata only.

## Expected output
Traceable experiment records, reproducibility procedure, variance statement, and retention rules.

## Stop conditions
Stop when data cannot be legally retained, versions cannot be resolved, or nondeterminism prevents meaningful comparison without further investigation.
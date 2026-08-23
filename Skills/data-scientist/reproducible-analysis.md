# Reproducible Analysis

## Purpose
Make analytical conclusions independently rerunnable, reviewable, and traceable to immutable inputs, code, parameters, and environment.

## When to use
Use for any analysis or model informing material decisions, publications, experiments, or production changes.

## Inputs
Code, data references, environment, configuration, random seeds, dependencies, and outputs.

## Context to inspect
Data mutability, notebook state, package versions, external services, manual steps, and artifact storage.

## Core knowledge
Reproducibility requires more than a saved notebook. Inputs must be versioned or snapshot-addressable; transformations must be deterministic enough to audit; environment and parameters must be captured.

## Procedure
1. Move critical logic from hidden interactive state into executable code.
2. Pin or record dependency and runtime versions.
3. Reference immutable or versioned input data.
4. Parameterize paths, dates, thresholds, and experiment settings.
5. Control randomness where feasible.
6. Separate source code from generated artifacts.
7. Capture metadata linking outputs to inputs and code revision.
8. Execute from a clean environment.
9. Add lightweight tests for critical transformations.
10. Document known nondeterminism.

## Decision points
Containerize when environment drift is material; a lockfile may suffice for simpler work. Preserve raw data rather than only derived extracts when governance permits.

## Common failure patterns
Notebook execution out of order, mutable SQL queries without snapshots, unpinned packages, manual spreadsheet edits, and undocumented local files.

## Verification
Re-run from a clean checkout/environment and compare key outputs within defined deterministic tolerances.

## Expected output
A rerunnable analysis with traceable data, code, environment, parameters, and artifacts.

## Stop conditions
Stop publication or handoff when critical inputs cannot be reconstructed or accessed by authorized reviewers.
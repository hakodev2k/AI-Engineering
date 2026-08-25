# Experiment Tracking and Reproducibility

## Purpose
Make ML experiments auditable, comparable and reproducible rather than dependent on notebook state or memory.

## When to use
Use for every material experiment that can influence a production decision.

## Inputs
Code revision, data versions, configuration, environment, metrics, artifacts and notes.

## Context to inspect
Existing tracking system, artifact retention, naming conventions and reproducibility gaps.

## Core knowledge
A metric without provenance is weak evidence. Reproduction requires code, data identity, environment, parameters, randomness and artifact lineage.

## Procedure
1. Assign each run a unique identity.
2. Capture repository revision and dirty-state information.
3. Record immutable dataset/split identifiers.
4. Persist complete resolved configuration.
5. Record environment and dependency versions.
6. Log metrics with step/time semantics.
7. Store model, preprocessing and evaluation artifacts together.
8. Link parent/child or comparison runs.
9. Tag promoted candidates and reasons.
10. Periodically reproduce representative historical runs.

## Decision points
Store large artifacts in artifact storage and metadata in the tracker. Retain enough history for audit while applying cost and privacy retention rules.

## Common failure patterns
Only logging final accuracy, mutable dataset names, missing preprocessing artifacts, overwritten runs and undocumented manual changes.

## Verification
Reproduce a selected run from recorded metadata and compare outputs within documented deterministic tolerance.

## Expected output
Traceable experiment records enabling reliable comparison and reproduction.

## Stop conditions
Do not promote a model whose decisive experiment cannot be traced to its code, data and configuration.
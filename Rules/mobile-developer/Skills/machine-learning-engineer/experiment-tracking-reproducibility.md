# Experiment Tracking and Reproducibility

## Purpose
Make ML results traceable, comparable, and reproducible across people, machines, and time.

## When to use
For all nontrivial training and evaluation workflows.

## Inputs
Code revision, dataset/version, configuration, environment, seeds, metrics, artifacts, runtime metadata.

## Context to inspect
Current tracking system, package locking, data versioning, artifact storage, nondeterministic operations, infrastructure differences.

## Core knowledge
A metric without code, data, and configuration lineage is weak evidence. Exact bitwise determinism is not always possible, but material conclusions must reproduce.

## Procedure
1. Assign immutable experiment/run identifiers.
2. Record code revision and dirty-state status.
3. Version dataset/split/feature definitions.
4. Capture full configuration and dependency environment.
5. Set and record random seeds where supported.
6. Store metrics, logs, checkpoints, and evaluation artifacts.
7. Link parent/child runs for searches.
8. Reproduce selected runs from a clean environment.

## Decision points
Use content-addressed immutable artifacts for high-value models; tolerate controlled nondeterminism when variance is measured and documented.

## Common failure patterns
Manual filenames, mutable datasets, untracked notebook edits, missing seeds, and recording only final metrics.

## Verification
A second environment can reconstruct a selected run and reproduce conclusions within defined tolerance.

## Expected output
Traceable experiment records and a repeatable execution path.

## Stop conditions
Do not promote a model when its training data, code, or configuration cannot be identified.
# Reproducible Research Environments

## Purpose
Create research environments in which another engineer can rerun an experiment and obtain materially equivalent behavior. Reproducibility reduces false conclusions caused by hidden package changes, hardware differences, mutable datasets, undocumented configuration, or nondeterministic execution.

## When to use
Use for any experiment expected to influence a research claim, publication, model selection, major product decision, or later reproduction. Apply before expensive training rather than reconstructing metadata afterward.

## Inputs
- Source repository
- Training and evaluation commands
- Dependency definitions
- Hardware/runtime requirements
- Dataset and checkpoint identifiers
- Experiment configuration

## Preconditions
The experiment must be runnable from code rather than manual notebook state alone. Determine what degree of determinism is feasible for the frameworks and hardware involved.

## Context to inspect
Inspect package lock files, container definitions, CUDA/driver versions, framework versions, compiler flags, environment variables, random seeds, distributed settings, data manifests, preprocessing code, artifact stores, and experiment tracking.

## Core knowledge
Exact bitwise determinism is not always possible or desirable on accelerated hardware, but reproducibility still requires versioned inputs and bounded variation. A Senior researcher distinguishes deterministic execution from reproducible conclusions: repeated runs may differ numerically while supporting the same claim.

## Procedure
1. Capture the exact code revision used for the experiment.
2. Pin direct and transitive dependencies where practical.
3. Record runtime, accelerator, driver, communication library, and compiler versions.
4. Version experiment configuration separately from ad hoc shell history.
5. Record all random seeds and deterministic-mode settings.
6. Version or fingerprint datasets, preprocessing code, tokenizers, and data filters.
7. Store immutable identifiers for initialization checkpoints and external artifacts.
8. Make training and evaluation entry points scriptable from a clean environment.
9. Record distributed topology, precision mode, gradient accumulation, and effective batch size.
10. Capture environment variables that affect numerical or performance behavior without storing secrets.
11. Run a clean-environment smoke test.
12. Repeat a representative experiment and compare expected tolerance bands.
13. Document known nondeterministic operations and expected variance.
14. Store logs, configs, metrics, and artifact references under a stable run identifier.

## Decision points
- Use containers when system dependencies materially affect behavior or environment recreation is otherwise unreliable.
- Prefer lock files for language dependencies even when containers are used.
- Require immutable dataset snapshots for confirmatory work; exploratory work may use evolving data only if the revision is recorded.
- Use deterministic kernels when debugging correctness, but avoid accepting severe performance costs by default for large production-scale experiments.

## Common failure patterns
- Recording only a requirements file with unpinned versions.
- Depending on notebook execution order.
- Using a mutable “latest” checkpoint or dataset.
- Omitting tokenizer or preprocessing revisions.
- Recording a random seed while leaving other nondeterministic sources uncontrolled.
- Storing secrets inside configs committed for reproducibility.
- Assuming two GPUs with the same model name have identical software stacks.

## Verification
Implementation is complete when a clean environment can launch the experiment from documented commands. Verification requires an independent rerun that reproduces the expected training trajectory or final metrics within predefined tolerance and can trace every major input to a versioned artifact.

## Expected output
A reproducibility record containing code revision, environment specification, hardware/runtime details, data fingerprints, artifact IDs, configs, commands, seeds, nondeterminism notes, and rerun evidence.

## Stop conditions
Stop and escalate when required artifacts are mutable or unavailable, proprietary dependencies cannot be versioned, secrets are necessary but cannot be securely provisioned, or rerun variance is large enough to invalidate the intended claim.
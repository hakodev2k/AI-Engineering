# Model Training and Experimentation

## Purpose
Run controlled, reproducible computer vision experiments that isolate causal improvements and prevent accidental regressions.

## When to use
Use during baseline creation, architecture/loss changes, hyperparameter tuning, or ablation studies.

## Inputs
Dataset version, model config, training code, hardware budget, target metrics.

## Preconditions
Data splits and evaluation code are fixed and versioned.

## Context to inspect
Random seeds, optimizer, scheduler, mixed precision, checkpoint policy, augmentation, distributed-training settings.

## Core knowledge
Experiment quality depends on changing few variables, preserving provenance, and distinguishing random variance from real gains.

## Procedure
1. Reproduce the current baseline.
2. Record code, data, config, environment, and seed.
3. Define one hypothesis per experiment where possible.
4. Monitor optimization, validation, throughput, and resource use.
5. Save checkpoints and failure artifacts.
6. Run ablations for claimed improvements.
7. Repeat borderline gains across seeds.
8. Promote only changes with measurable benefit and acceptable cost.

## Decision points
Longer training vs better schedule; full fine-tune vs frozen layers; manual tuning vs bounded search.

## Common failure patterns
Changing multiple variables, cherry-picking runs, untracked data changes, comparing unequal budgets, ignoring seed variance.

## Verification
A clean rerun must reproduce the result within expected variance and preserve evaluation parity.

## Expected output
Experiment record, configs, metrics, ablation evidence, and promotion recommendation.

## Stop conditions
Stop when baseline cannot be reproduced, experiment provenance is incomplete, or compute cost exceeds agreed limits.
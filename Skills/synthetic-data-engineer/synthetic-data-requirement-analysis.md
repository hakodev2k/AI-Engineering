# Synthetic Data Requirement Analysis

## Purpose
Translate a data shortage, privacy, simulation, or coverage problem into a measurable synthetic-data contract.

## When to use
Before generating synthetic training, evaluation, test, or simulation data.

## Inputs
Target task, real-data profile, downstream consumer, quality constraints, privacy rules, coverage gaps, and budget.

## Context to inspect
Inspect schemas, distributions, labels, rare slices, downstream metrics, data licenses, and current pipeline.

## Core knowledge
Synthetic data is useful only relative to a downstream objective. Fidelity, diversity, privacy, controllability, and utility can conflict.

## Procedure
1. Define the downstream decision or model behavior to improve.
2. Identify why real data is insufficient.
3. Specify schema, semantics, labels, and invariants.
4. Define target distributions and rare slices.
5. Record prohibited memorization or sensitive attributes.
6. Define measurable fidelity, diversity, privacy, and utility criteria.
7. Establish a real-data baseline and holdout.
8. Define acceptance and stop thresholds.
9. Document assumptions and owners.

## Decision points
Use synthetic data for controlled coverage or privacy when evidence supports it; prefer real data when realistic collection is safer and cheaper.

## Common failure patterns
Generating data before defining utility; matching marginals while breaking relationships; leaking real records; optimizing visual plausibility only.

## Verification
Every requirement maps to a test and downstream utility can be compared against a real-data baseline.

## Expected output
A versioned synthetic-data contract and acceptance suite.

## Stop conditions
Stop when legal/privacy constraints are unresolved, downstream metrics are undefined, or required real-data reference cannot be accessed safely.
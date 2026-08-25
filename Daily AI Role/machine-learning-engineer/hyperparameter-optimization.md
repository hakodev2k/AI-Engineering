# Hyperparameter Optimization

## Purpose
Tune models efficiently without turning validation data into an implicit training set.

## When to use
Use after a sound baseline and stable evaluation protocol exist.

## Inputs
Search space, objective metrics, compute budget, constraints, splits and baseline configuration.

## Context to inspect
Parameter sensitivity, training variance, early-stopping behavior, prior experiments and resource contention.

## Core knowledge
Search quality depends more on a meaningful search space and unbiased evaluation than on optimizer sophistication. Repeated tuning increases selection bias.

## Procedure
1. Freeze the evaluation protocol.
2. Define bounded, scale-appropriate parameter ranges.
3. Identify conditional parameters.
4. Set compute and wall-clock budgets.
5. Start with random or low-discrepancy search for broad exploration.
6. Use early stopping/pruning only on valid intermediate signals.
7. Track every trial and failure.
8. Inspect sensitivity, not only the winning trial.
9. Retrain finalists across multiple seeds/folds where variance matters.
10. Evaluate the chosen configuration once on untouched test data.

## Decision points
Use Bayesian optimization for expensive smooth-ish searches; population/evolutionary methods for complex conditional spaces; manual tuning only when the space is tiny and hypotheses are explicit.

## Common failure patterns
Tuning before fixing leakage, huge arbitrary spaces, optimizing one noisy metric, test-set peeking, ignoring failed trials and resource cost.

## Verification
Reproduce the winning trial, quantify variance, and confirm improvement survives untouched evaluation and constraints.

## Expected output
A reproducible selected configuration plus search history and sensitivity evidence.

## Stop conditions
Stop when gains fall below practical significance, budget is exhausted, or evaluation integrity is compromised.
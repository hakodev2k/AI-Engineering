# Data Mixture Design

## Purpose
Design the relative composition of heterogeneous datasets so training compute is spent on the capabilities, domains, languages, and behaviors that matter most.

## When to use
Use when combining multiple corpora, sources, languages, task types, or quality tiers for pretraining, continued pretraining, fine-tuning, or preference optimization.

## Inputs
Candidate datasets, quality profiles, unique token/example counts, target capabilities, evaluation slices, training budget, and prior experiment results.

## Context to inspect
Inspect source duplication, sampling policies, curriculum or epoch behavior, tokenizer effects, domain imbalance, model regressions, and how the trainer applies source weights.

## Core knowledge
Mixture weights control exposure, not just storage proportions. A small dataset can dominate through repeated epochs, and a massive source can dilute strategically important data. Mixture design should be experiment-driven and evaluated for interactions between sources.

## Procedure
1. Group datasets by meaningful capability and provenance.
2. Measure unique volume and quality for each group.
3. Define target exposure ranges based on product and model goals.
4. Estimate repeat rates under the training token budget.
5. Cap low-diversity sources to reduce memorization.
6. Create a baseline mixture and explicit hypotheses for deviations.
7. Run controlled pilot experiments or ablations where feasible.
8. Compare slice-level gains and regressions.
9. Adjust weights based on marginal utility, not intuition alone.
10. Version mixture configuration and training-data manifest together.

## Decision points
Increase weight when a high-value slice is underlearned and the source remains diverse. Collect new data instead of repeating a tiny corpus excessively. Downweight broad low-quality sources when compute is scarce, even if they dominate raw volume.

## Common failure patterns
- Using source size as mixture weight
- Ignoring repeated exposure
- Changing multiple weights without an experiment plan
- Failing to measure cross-domain regressions
- Mixing incompatible quality tiers without controls

## Verification
Implemented means training samples match configured exposure proportions. Verified means experiment results support the chosen weights and no critical slice regresses beyond agreed limits.

## Expected output
A versioned mixture specification with source weights, expected exposure, repeat rates, hypotheses, and validation results.

## Stop conditions
Stop when dataset lineage is incomplete, exposure cannot be measured, or evaluation coverage is insufficient to judge mixture trade-offs.
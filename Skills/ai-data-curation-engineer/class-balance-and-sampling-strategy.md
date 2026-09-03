# Class Balance and Sampling Strategy

## Purpose
Design sampling and weighting so the dataset represents intended model behavior rather than the accidental frequency distribution of available data.

## When to use
Use when classes, domains, languages, sources, difficulty bands, safety cases, or user segments are strongly imbalanced.

## Inputs
Dataset statistics, target task distribution, model errors, business priorities, source quality, and training budget.

## Context to inspect
Inspect natural production frequencies, evaluation slices, rare but high-impact cases, duplication, label confidence, and how the trainer applies example or source weights.

## Core knowledge
Balanced data is not always 50/50. Training distribution may intentionally differ from production to improve rare capabilities, but evaluation must remain representative. Oversampling can cause memorization; undersampling can discard useful diversity.

## Procedure
1. Define slices that materially affect model behavior.
2. Measure raw counts, unique counts, and quality by slice.
3. Compare observed data with target operational distribution.
4. Identify rare high-impact or underperforming slices.
5. Choose sampling, weighting, or additional collection strategy.
6. Cap repeated exposure of small slices.
7. Preserve a representative validation set independent of training weights.
8. Simulate resulting mixture proportions.
9. Run pilot training where practical.
10. Adjust using slice-level performance and regression evidence.

## Decision points
Use reweighting when data exists but should contribute differently; collect more when rare slices lack diversity; undersample dominant low-value data when compute is constrained. Avoid oversampling tiny sets beyond their information content.

## Common failure patterns
- Equalizing labels without considering production priors
- Oversampling duplicates
- Ignoring quality differences across classes
- Tuning the validation distribution to match training
- Hiding mixture weights in ad hoc code

## Verification
Implemented means the sampler reproducibly creates the intended mixture. Verified means exposure statistics match design and model performance improves on target slices without unacceptable overall regression or memorization.

## Expected output
A versioned sampling policy, mixture table, rationale, exposure limits, and slice-level validation evidence.

## Stop conditions
Stop when target distribution is undefined, rare slices contain too little unique signal, or weighting changes cannot be evaluated independently.
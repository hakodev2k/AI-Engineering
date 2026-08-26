# Image Data Generation

## Purpose
Generate controlled synthetic imagery and annotations for vision training and evaluation.

## When to use
For rare scenes, privacy-sensitive domains, simulation, domain randomization, or annotation scarcity.

## Inputs
Target classes, scene factors, annotation schema, reference distribution, generator/simulator, and downstream vision task.

## Context to inspect
Inspect camera/domain characteristics, class imbalance, occlusion, lighting, backgrounds, label quality, and real holdout data.

## Core knowledge
Photorealism does not guarantee task utility. Coverage of causal scene factors and the synthetic-to-real domain gap are central.

## Procedure
1. Define scene variables and target coverage.
2. Specify annotation generation and coordinate conventions.
3. Randomize nuisance factors without violating physics/domain rules.
4. Generate balanced and rare scenarios.
5. Validate labels geometrically and semantically.
6. Measure image statistics and representation distance to real data.
7. Train/evaluate on real holdout data.
8. Tune synthetic/real mixing and augmentation.
9. Inspect failure slices visually.
10. Record generator assets and seeds.

## Decision points
Use simulation when labels/physics are controllable; generative models when visual diversity matters and annotation reliability can be validated.

## Common failure patterns
Beautiful but irrelevant images; annotation mismatch; generator artifacts becoming shortcuts; unrealistic class balance.

## Verification
Real holdout metrics and slice robustness meet thresholds; annotations pass independent checks.

## Expected output
Reproducible image corpus, annotations, coverage matrix, and utility report.

## Stop conditions
Stop if licensing is unclear, labels cannot be trusted, or synthetic-to-real performance materially degrades.
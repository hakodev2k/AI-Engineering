# Distribution Fidelity Evaluation

## Purpose
Measure how well synthetic data reproduces the real-world properties that matter for a downstream task without mistaking superficial similarity for usefulness.

## When to use
Use after fitting a generator, before releasing a synthetic dataset, or when synthetic-to-real transfer is weaker than expected.

## Inputs
Synthetic dataset, approved real reference data, feature schema, segment definitions, temporal structure, target task, fidelity thresholds.

## Preconditions
Reference data is representative enough for the intended comparison and is isolated from final downstream evaluation where required.

## Context to inspect
Marginal distributions, correlations, conditional distributions, tails, missingness, temporal patterns, subgroup prevalence, relational structure, semantic embeddings.

## Core knowledge
No single fidelity metric is sufficient. High aggregate similarity can hide subgroup collapse, rare-event loss, or unrealistic conditional relationships. Fidelity should be weighted toward properties that influence downstream decisions.

## Procedure
1. Define task-relevant fidelity dimensions before examining results.
2. Compare schema, ranges, categories, missingness, and cardinalities.
3. Compare univariate distributions using appropriate statistical distances.
4. Compare correlations and conditional dependencies.
5. Evaluate tails, rare categories, and subgroup intersections separately.
6. Check temporal or relational structure where applicable.
7. Use embedding or classifier-based comparisons for high-dimensional modalities.
8. Detect generator-specific artifacts and mode collapse.
9. Compare results across generator versions and random seeds.
10. Relate fidelity gaps to downstream model errors rather than optimizing metrics blindly.

## Decision points
Prioritize fidelity on task-critical variables over global similarity. Accept intentional distribution shifts when they are documented and serve a coverage objective.

## Common failure patterns
Reporting one score, ignoring rare segments, treating matching means as sufficient, and tuning to a reference set until it becomes an implicit training set.

## Verification
A reviewed fidelity report demonstrates that critical distributions and dependencies meet thresholds and known intentional differences are documented.

## Expected output
A multidimensional fidelity report with segment-level findings, visual/statistical evidence, and remediation priorities.

## Stop conditions
Stop when reference data is too biased or small to support meaningful fidelity claims, or when synthetic similarity depends on unacceptable privacy leakage.
# Active Learning and Hard Example Mining

## Purpose
Prioritize examples that are likely to improve the model most, rather than labeling or collecting uniformly across abundant easy data.

## When to use
Use when labeling is expensive, model errors cluster in specific regions, rare cases matter, or an existing model can help rank data acquisition value.

## Inputs
Current model, unlabeled pool, model outputs or uncertainty signals, error taxonomy, labeling budget, evaluation slices, and diversity constraints.

## Context to inspect
Inspect model calibration, uncertainty quality, current dataset coverage, source bias, duplicate clusters, annotation cost, and whether candidate selection itself changes the observed distribution.

## Core knowledge
Uncertainty sampling can overselect noise or out-of-distribution artifacts. Hard-example mining should balance informativeness with diversity and representativeness. Model disagreement, loss, margin, entropy, ensemble variance, embedding diversity, and known failure heuristics provide different signals.

## Procedure
1. Define target failure classes and labeling budget.
2. Establish a random or stratified baseline sample.
3. Score candidates using one or more validated informativeness signals.
4. Remove duplicates and obvious low-quality artifacts.
5. Add diversity constraints across domains, sources, and embeddings.
6. Reserve some random sampling to detect blind spots.
7. Label the selected batch with normal quality controls.
8. Retrain or evaluate and measure marginal gain per labeled example.
9. Analyze which selection signals produced useful examples.
10. Iterate until marginal value falls below the collection threshold.

## Decision points
Use uncertainty when probabilities are calibrated enough to be meaningful; use disagreement when multiple models are available; use targeted heuristics for known critical failures. Prefer random exploration when the current model may be confidently wrong.

## Common failure patterns
- Selecting only maximum-loss examples
- Mining annotation errors as hard examples
- Repeatedly choosing near duplicates
- Eliminating random exploration
- Measuring total gain without gain per annotation cost

## Verification
Implemented means candidates are selected reproducibly. Verified means selected batches improve target metrics more efficiently than the baseline without narrowing coverage excessively.

## Expected output
A ranked acquisition batch, selection rationale, diversity statistics, annotation results, and marginal-utility report.

## Stop conditions
Stop when uncertainty signals are unvalidated, the unlabeled pool lacks required coverage, or iterative selection stops producing measurable benefit.
# Model Selection Rules
## Purpose
Choose models by evidence and operational fit rather than novelty.
## Scope
Algorithm, architecture, hyperparameter, and baseline selection.
## MUST
- Compare candidates against a meaningful baseline on held-out evidence aligned with the business objective.
- Consider calibration, interpretability, latency, robustness, maintenance, cost, and failure impact alongside predictive score.
- Keep final test data isolated from iterative selection.
## MUST NOT
- Select a model because it is newer or more complex without measurable benefit.
- Tune repeatedly against the final test set.
## SHOULD
- Prefer simpler models when they satisfy requirements comparably.
## Exceptions
Research exploration may prioritize novelty but must not be represented as production selection evidence.
## Verification
Inspect experiment history, baselines, held-out protocol, metric matrix, and decision rationale.
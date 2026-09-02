# Evaluation Baselines

## Purpose
Keep monitoring comparisons anchored to valid, reproducible, and governed reference evidence.

## Scope
Applies to offline evaluation baselines, production reference windows, champion models, and historical comparison datasets.

## MUST
- Every operational baseline MUST record its model version, dataset or cohort definition, metric definition, time range, and creation rationale.
- Baseline changes MUST be reviewed when they can change whether a production regression is detected.
- Historical comparisons MUST account for known changes in population, labels, product behavior, or metric semantics.
- Baselines MUST be reproducible from retained artifacts or equivalent immutable evidence where practical.

## MUST NOT
- MUST NOT move a baseline merely because current production behavior falls outside thresholds.
- MUST NOT compare metrics computed with incompatible definitions.
- MUST NOT use an unrepresentative test dataset as a production-health baseline without documenting limitations.

## SHOULD
- Maintain multiple baselines when seasonal, regional, or cohort behavior materially differs.
- Retire stale baselines explicitly rather than silently replacing them.

## Exceptions
Non-reproducible legacy baselines require documented limitations, replacement plan, and owner approval.

## Verification
Review baseline metadata, evaluation artifacts, metric versions, change history, and reproducibility or backtest results.
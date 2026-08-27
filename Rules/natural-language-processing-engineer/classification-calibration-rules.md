# Classification and Calibration Rules

## Purpose
Make NLP classification decisions measurable and threshold behavior defensible.

## Scope
Single-label, multilabel, ranking-derived classification, confidence calibration, thresholds, abstention, and imbalance.

## MUST
- Class definitions and decision thresholds MUST be explicit and versioned.
- Thresholds MUST be selected using task costs and validation evidence, not arbitrary defaults.
- High-impact classifiers MUST evaluate calibration, false-positive, and false-negative behavior on critical slices.
- Imbalance handling MUST be evaluated against real decision metrics.

## MUST NOT
- MUST NOT interpret raw model scores as probabilities unless calibration or model semantics justify it.
- MUST NOT optimize accuracy alone when class imbalance makes it misleading.
- MUST NOT change thresholds in production without impact analysis and monitoring.

## SHOULD
- Systems SHOULD support abstention or human review when uncertainty and consequence justify it.
- Calibration SHOULD be rechecked after material distribution shifts.

## Exceptions
Uncalibrated scores may be used for relative ranking only when consumers are explicitly prevented from treating them as probabilities.

## Verification
Inspect confusion matrices, precision-recall curves, calibration plots, threshold rationale, subgroup metrics, abstention tests, and production decision-rate monitoring.
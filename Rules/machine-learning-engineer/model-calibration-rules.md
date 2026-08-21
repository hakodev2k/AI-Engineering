# Model Calibration Rules
## Purpose
Ensure model scores support valid downstream decisions.
## Scope
Probabilities, confidence scores, thresholds, and risk estimates.
## MUST
- Validate calibration when downstream behavior interprets scores probabilistically.
- Choose operating thresholds from explicit cost, risk, capacity, or policy constraints.
- Re-evaluate thresholds when prevalence or decision costs materially change.
## MUST NOT
- Treat arbitrary default thresholds as business requirements.
- Present uncalibrated scores as probabilities.
## SHOULD
- Report calibration by important cohort when consequential.
## Exceptions
Ranking-only systems may omit probability calibration when scores are never interpreted probabilistically.
## Verification
Inspect calibration curves, threshold analysis, decision-cost assumptions, and production score distributions.
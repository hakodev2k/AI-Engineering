# Calibration and Parameter Estimation Rules
## Purpose
Prevent overfitting and unsupported parameter tuning.
## Scope
Calibration, parameter identification, fitting, and inverse problems.
## MUST
- Separate calibration evidence from validation evidence.
- Define objective functions, bounds, priors, and stopping criteria before final calibration.
- Quantify parameter uncertainty and identifiability when material to conclusions.
## MUST NOT
- Tune parameters against validation data and then claim independent validation.
- hide implausible parameter values that compensate for structural model error.
## SHOULD
- Compare multiple plausible parameter sets when non-identifiability exists.
## Exceptions
Joint fitting requires explicit methodology and adjusted validation claims.
## Verification
Inspect datasets, optimization configuration, residuals, parameter bounds, and holdout validation.
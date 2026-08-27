# Sensitivity and Uncertainty Rules
## Purpose
Expose how uncertain assumptions and parameters affect conclusions.
## Scope
Sensitivity analysis, uncertainty propagation, confidence bounds, and robustness studies.
## MUST
- Identify material uncertainty sources before decision-grade use.
- Propagate important input uncertainty to decision-relevant outputs.
- Separate aleatory variability from epistemic uncertainty when their treatment differs.
## MUST NOT
- Report excessive numerical precision unsupported by model uncertainty.
- claim robustness without perturbation or equivalent evidence.
## SHOULD
- Prioritize uncertainty reduction using sensitivity evidence.
## Exceptions
Deterministic bounds may replace probabilistic analysis when justified and conservative.
## Verification
Review uncertainty inventory, sampling/bounding method, sensitivity rankings, intervals, and robustness evidence.
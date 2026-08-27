# Model Fidelity Rules
## Purpose
Ensure simulation models represent the intended physical, operational, or stochastic system closely enough for the decision being made.
## Scope
All production, research, training, and decision-support simulations.
## MUST
- Define the model purpose, validity domain, assumptions, state variables, and fidelity targets before implementation.
- Trace material simplifications to evidence and quantify their expected effect where practical.
- Validate model behavior against trusted analytical results, measurements, or accepted reference models.
## MUST NOT
- Present behavior outside the validated domain as reliable.
- Increase complexity without evidence that it improves decision-relevant fidelity.
## SHOULD
- Prefer the simplest model that satisfies documented accuracy requirements.
## Exceptions
Exceptions require rationale, affected outputs, risk, compensating verification, and reviewer approval.
## Verification
Review assumptions, validation datasets, residual/error analysis, and acceptance thresholds.
# Surrogate and Reduced-Order Model Rules
## Purpose
Control approximation error when replacing expensive high-fidelity models.
## Scope
Surrogates, emulators, reduced-order models, response surfaces, and learned approximations.
## MUST
- Define the training/design domain and validate approximation error on independent cases.
- Detect or flag inputs outside the supported domain.
- Compare downstream decision impact against the reference model, not only aggregate fit metrics.
## MUST NOT
- silently substitute a surrogate where high-fidelity execution is required by policy.
- claim accuracy from training error alone.
## SHOULD
- Track uncertainty or confidence for surrogate predictions where feasible.
## Exceptions
Exploratory approximations must be labeled non-authoritative.
## Verification
Holdout tests, boundary cases, reference-model comparisons, extrapolation checks, and error budgets.
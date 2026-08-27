# Stochastic Randomness Rules
## Purpose
Make stochastic simulation statistically valid and reproducible.
## Scope
Random sampling, Monte Carlo methods, stochastic processes, and randomized scenarios.
## MUST
- Use documented distributions justified by evidence or explicit assumptions.
- Control and record random seeds for reproducible runs.
- Use enough independent samples to support stated confidence or error bounds.
## MUST NOT
- Reuse correlated random streams where independence is assumed.
- Report a single stochastic run as representative without justification.
## SHOULD
- Use variance-reduction techniques when they preserve unbiased interpretation.
## Exceptions
Exploratory runs may use small samples if clearly labeled non-conclusive.
## Verification
Review seed handling, distribution tests, independence assumptions, confidence intervals, and convergence by sample count.
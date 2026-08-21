# Causal Inference Rules
## Purpose
Prevent unsupported causal claims.
## Scope
Observational causal analysis and quasi-experiments.
## MUST
- State the causal estimand, treatment, outcome, population, identification assumptions, and plausible confounders.
- Justify identification strategy with domain knowledge and design evidence.
- Test robustness to alternative specifications and plausible violations where practical.
## MUST NOT
- Infer causation from correlation, feature importance, or predictive accuracy alone.
- Control mechanically for post-treatment variables or colliders.
## SHOULD
- Use causal diagrams or equivalent explicit assumption models for complex analyses.
## Exceptions
Associational analyses must be labeled non-causal.
## Verification
Review estimand definition, assumptions, design, balance/diagnostics, sensitivity checks, and claim wording.
# Explainability Rules
## Purpose
Ensure explanations are accurate enough for their audience and decision risk.
## Scope
Feature attribution, model interpretation, reason codes, and stakeholder explanations.
## MUST
- Match explanation method to model, question, audience, and required fidelity.
- Distinguish global behavior, local attribution, association, and causality.
- Validate explanations for stability when they influence consequential decisions.
## MUST NOT
- Present feature importance or attribution as causal effect without causal evidence.
- Use plausible narratives as substitutes for validated explanations.
## SHOULD
- Prefer inherently interpretable models when explanation requirements dominate marginal accuracy gains.
## Exceptions
Opaque models require documented justification and compensating controls.
## Verification
Inspect explanation method assumptions, stability tests, model cards, and stakeholder-facing wording.
# Experimentation Rules
## Purpose
Use experiments to reduce uncertainty without overstating evidence.
## Scope
A/B tests, prototypes, pilots, feature flags, and hypothesis validation.
## MUST
- Define hypothesis, target population, primary metric, guardrails, duration or stopping rule, and decision threshold before launch.
- Preserve experiment integrity and document material deviations.
- Evaluate negative and unintended outcomes, not only primary uplift.
## MUST NOT
- Stop experiments opportunistically when results first appear favorable.
- Claim causality from uncontrolled observations without qualification.
## SHOULD
- Use the lowest-cost experiment capable of resolving the key uncertainty.
## Exceptions
Low-risk qualitative prototypes may use lighter statistical rigor when conclusions remain appropriately limited.
## Verification
Inspect experiment plans, assignment logic, metric definitions, guardrails, analysis, and decision records.
# Technical Communication Rules

## Purpose
Make architecture understandable, reviewable, and actionable for engineers, stakeholders, operations, and governance teams.

## Scope
Applies to architecture documents, diagrams, decision records, presentations, reviews, and handoffs.

## MUST
- Architecture communication MUST distinguish facts, assumptions, decisions, risks, and recommendations.
- Diagrams MUST define boundaries, direction of flow, and relevant ownership rather than serve as decoration.
- Material trade-offs MUST be explained in language appropriate to the decision audience.
- Risks and unresolved questions MUST remain visible until resolved or explicitly accepted.
- Architecture artifacts MUST be updated when material decisions change.

## MUST NOT
- MUST NOT use unexplained jargon to hide uncertainty.
- MUST NOT present conceptual diagrams as deployment truth without labeling abstraction level.
- MUST NOT omit significant disadvantages from stakeholder-facing recommendations.

## SHOULD
- Use multiple views when one diagram cannot communicate logical, deployment, data, and security concerns clearly.
- Keep architecture artifacts concise enough to remain maintainable.

## Exceptions
Informal exploration may use rough diagrams if they are not presented as approved architecture.

## Verification
Review documents for traceability, current state, decision clarity, labeled assumptions, audience comprehension, and consistency between diagrams and implemented systems.
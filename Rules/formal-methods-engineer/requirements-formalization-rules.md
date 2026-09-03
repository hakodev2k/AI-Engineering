# Requirements Formalization Rules

## Purpose
Convert ambiguous natural-language requirements into precise, reviewable formal obligations without losing stakeholder intent.

## Scope
Applies to safety, liveness, security, timing, ordering, consistency, and functional requirements selected for formal analysis.

## MUST
- Preserve traceability from each formalized requirement to its source requirement or approved design decision.
- Identify quantifiers, temporal scope, boundary conditions, exceptional cases, and prohibited states explicitly.
- Flag contradictory, incomplete, or untestable source requirements before claiming formal coverage.
- Distinguish required behavior from assumptions about users, operators, dependencies, and environments.
- Obtain domain review for semantics that materially affect business or safety outcomes.

## MUST NOT
- Strengthen or weaken a requirement silently during formalization.
- Replace ambiguous language with an arbitrary interpretation without recording the decision.
- Claim a property represents stakeholder intent solely because the formula is internally consistent.

## SHOULD
- Maintain readable companion statements beside formal formulas.
- Prefer property patterns that reviewers can recognize and validate repeatedly.

## Exceptions
Interpretive decisions may proceed when necessary only with documented alternatives, selected semantics, risk, and accountable approval.

## Verification
Use bidirectional traceability review, stakeholder or domain-expert signoff, requirement-property coverage matrices, boundary examples, and adversarial interpretation review.
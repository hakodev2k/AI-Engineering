# Requirement Clarification Rules
## Purpose
Prevent teams from implementing uncertain assumptions as requirements.
## Scope
Technical interpretation of product requirements, constraints, acceptance criteria, and non-functional needs.
## MUST
- Material ambiguity affecting design, security, data, compatibility, or operations MUST be surfaced before irreversible implementation.
- Technical assumptions MUST be recorded when they influence scope or architecture.
- Non-functional requirements relevant to critical flows MUST be made measurable where practical.
## MUST NOT
- Invent business behavior merely to avoid clarification.
- Treat an implementation detail as a product requirement without evidence.
## SHOULD
- Resolve ambiguity with concrete examples, edge cases, and acceptance criteria.
## Exceptions
Reversible low-risk assumptions may proceed if documented and easy to change.
## Verification
Inspect requirements, decision notes, acceptance tests, assumptions, and stakeholder confirmations.
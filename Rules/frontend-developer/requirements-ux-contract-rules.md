# Requirements and UX Contract Rules
## Purpose
Ensure implementation decisions preserve approved user outcomes and surface ambiguity before code hardens it.
## Scope
Requirements, UX specifications, edge cases, acceptance criteria, and frontend feasibility.
## MUST
- Ambiguous behavior affecting data, security, accessibility, destructive actions, or public contracts MUST be clarified or explicitly documented before implementation commitment.
- Frontend feasibility concerns and browser constraints MUST be raised with evidence early enough to influence design.
- Acceptance criteria MUST include meaningful empty, loading, error, permission, and boundary states when relevant.
- Implementation deviations from approved UX behavior MUST be visible to the responsible decision owner.
## MUST NOT
- Engineers MUST NOT invent business policy merely to close an unspecified UI case.
- Visual mockups MUST NOT be treated as complete behavioral specifications when state transitions are missing.
## SHOULD
- Use prototypes or small technical spikes to resolve expensive uncertainty.
## Exceptions
Low-risk reversible assumptions may proceed when clearly recorded and validated promptly.
## Verification
Requirement/UX review, acceptance tests, decision records, and comparison of delivered states to approved behavior.
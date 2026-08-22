# Design Handoff Rules
## Purpose
Transfer design intent to implementation without ambiguity or silent loss of critical behavior.
## Scope
Specifications, assets, states, tokens, annotations, and acceptance criteria.
## MUST
- Specify behavior, responsive rules, states, content, accessibility, and edge cases needed for implementation.
- Reference authoritative shared components and tokens when available.
- Resolve material implementation ambiguities before release.
- Review implemented critical journeys for fidelity and functional intent.
## MUST NOT
- Treat static screenshots as sufficient specification for stateful interactions.
- Require pixel matching that conflicts with accessibility or platform behavior.
## SHOULD
- Collaborate with engineering early on technically risky interactions.
## Exceptions
Low-risk cosmetic changes may use lightweight handoff when acceptance criteria are clear.
## Verification
Compare implementation against designs, states, tokens, accessibility criteria, and approved deviations.
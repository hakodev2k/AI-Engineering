# Architecture Boundary Rules

## Purpose
Prevent full-stack convenience from collapsing system boundaries into unmaintainable coupling.
## Scope
Modules, layers, domains, shared code, and dependencies.
## MUST
- Keep domain/business decisions independent from UI and persistence implementation details where practical.
- Define ownership for shared contracts and cross-cutting infrastructure.
- Document significant architecture changes with constraints and trade-offs.
## MUST NOT
- Create circular dependencies between layers or modules.
- Move logic into a shared package solely to bypass ownership boundaries.
## SHOULD
- Prefer cohesive vertical capabilities with explicit interfaces over indiscriminate shared abstractions.
## Exceptions
Boundary violations require measurable benefit, bounded scope, and remediation or ownership decision.
## Verification
Dependency graphs, architecture tests, code review, and decision records.
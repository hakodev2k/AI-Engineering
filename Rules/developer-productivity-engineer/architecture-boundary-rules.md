# Developer Platform Architecture Rules
## Purpose
Keep productivity systems evolvable without centralizing unnecessary coupling.
## Scope
Tooling services, plugins, APIs, build integrations, shared libraries, and platform boundaries.
## MUST
- Shared interfaces MUST have explicit ownership, compatibility expectations, and failure semantics.
- Architecture changes with broad blast radius MUST document constraints, alternatives, migration, and rollback.
- Dependencies MUST flow through intentional contracts rather than hidden filesystem, environment, or network assumptions.
- Central platform components MUST justify critical-path placement with reliability and latency evidence.
## MUST NOT
- MUST NOT introduce mandatory global dependencies when a local or optional boundary meets requirements without equivalent risk.
- MUST NOT break public internal contracts accidentally.
## SHOULD
- Platform capabilities SHOULD expose composable primitives plus opinionated golden paths.
## Exceptions
Tight coupling requires documented benefit, blast radius, owner, and exit strategy.
## Verification
Review dependency graph, API contracts, architecture decisions, failure tests, and compatibility checks.
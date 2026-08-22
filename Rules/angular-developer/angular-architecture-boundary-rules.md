# Angular Architecture Boundary Rules

## Purpose
Keep Angular applications evolvable by enforcing explicit feature, domain, and dependency boundaries.

## Scope
Standalone components, feature areas, libraries, routing boundaries, shared code, and dependency direction.

## MUST
- Organize code around cohesive product or domain capabilities rather than technical file types when the application is non-trivial.
- Define which layer owns domain orchestration, UI composition, infrastructure access, and reusable primitives.
- Keep dependencies directed toward stable abstractions and prevent feature-to-feature coupling that bypasses public interfaces.
- Review boundary changes for ownership, test impact, lazy-loading impact, and migration cost.

## MUST NOT
- Turn `shared` or `core` areas into unrestricted dumping grounds.
- Import another feature's private implementation to avoid defining a supported contract.
- Introduce circular dependencies.

## SHOULD
- Use workspace/library boundaries or lint rules to make architecture constraints machine-checkable where practical.

## Exceptions
A temporary boundary violation requires documented reason, owner, removal condition, and verification that it does not create a dependency cycle.

## Verification
Inspect dependency graphs, lint/architecture checks, route boundaries, public exports, and representative code review diffs.
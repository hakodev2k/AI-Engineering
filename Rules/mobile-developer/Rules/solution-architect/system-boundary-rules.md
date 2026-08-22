# System Boundary Rules

## Purpose
Maintain clear ownership, reduce accidental coupling, and protect changeability across systems and modules.

## Scope
Applies to services, modules, bounded contexts, shared libraries, databases, external integrations, and ownership boundaries.

## MUST
- Every major component MUST have a clear responsibility and ownership boundary.
- Data ownership MUST align with the system responsible for the authoritative business lifecycle.
- Cross-boundary communication MUST use explicit contracts.
- Shared libraries MUST be limited to genuinely shared stable concerns and MUST NOT become hidden coupling channels.
- Boundary changes MUST evaluate downstream compatibility and operational ownership.

## MUST NOT
- MUST NOT allow multiple systems to independently mutate the same authoritative data without an explicit consistency model.
- MUST NOT use a shared database as an undocumented integration contract.
- MUST NOT create distributed boundaries where deployment or team independence provides no meaningful value.

## SHOULD
- Prefer cohesive boundaries based on business capabilities over technical layering alone.
- Keep internal implementation details private behind stable contracts.

## Exceptions
Legacy constraints may require temporary coupling with documented migration ownership and exit criteria.

## Verification
Review component diagrams, ownership maps, API/event contracts, database access paths, dependency graphs, and deployment boundaries.
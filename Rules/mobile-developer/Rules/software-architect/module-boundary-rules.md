# Module Boundary Rules

## Purpose
Protect cohesion, ownership, and independent evolution between software modules.

## Scope
Applies to modules, packages, components, services, shared libraries, and dependency direction.

## MUST
- Each module MUST have a clear responsibility, public surface, and ownership boundary.
- Cross-module dependencies MUST flow through explicit contracts rather than internal implementation details.
- Shared abstractions MUST exist only when they represent stable shared concepts or capabilities.
- Boundary changes MUST assess downstream compatibility and coupling impact.

## MUST NOT
- MUST NOT create circular dependencies between architectural modules.
- MUST NOT expose internal persistence, framework, or transport details through public module contracts without justification.
- MUST NOT use a shared module as an uncontrolled dumping ground for unrelated utilities.

## SHOULD
- Prefer high cohesion within modules and low coupling between modules.
- Prefer dependency rules that can be enforced by tooling or architecture tests.

## Exceptions
Temporary boundary violations require an owner, removal plan, risk statement, and review date.

## Verification
Inspect dependency graphs, architecture tests, public APIs, package references, and code review diffs.
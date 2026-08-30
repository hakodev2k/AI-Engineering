# Build Architecture Rules

## Purpose
Ensure the build system has explicit boundaries, ownership, and dependency direction so it remains scalable, diagnosable, and safe to change.

## Scope
Applies to build orchestration, repository structure, target definitions, build graph ownership, generated code, shared build logic, and integrations with CI or release systems.

## MUST
- The build architecture MUST define clear layers for source discovery, dependency resolution, compilation, testing, packaging, and publication.
- Shared build logic MUST have explicit ownership and compatibility expectations.
- Build targets MUST declare their inputs, outputs, and dependencies in a form that reviewers and tooling can inspect.
- Generated artifacts MUST have an authoritative producer; competing generators for the same output are prohibited.
- Architecture changes that affect many targets or repositories MUST document migration impact, rollback strategy, and compatibility risks.

## MUST NOT
- MUST NOT hide critical build behavior in undocumented shell side effects or ambient machine state.
- MUST NOT create dependency cycles between build modules or target groups.
- MUST NOT couple unrelated products through convenience dependencies that are not required for their outputs.

## SHOULD
- Build architecture SHOULD minimize global mutable state and favor composable, deterministic primitives.
- Shared abstractions SHOULD be introduced only when they reduce duplicated policy without obscuring target-specific behavior.

## Exceptions
Exceptions MUST document the reason, affected targets, alternative considered, risk, and review owner. Temporary exceptions SHOULD include a removal condition.

## Verification
Inspect the build graph, target definitions, repository build modules, generated-output ownership, and architecture documentation. CI SHOULD include cycle detection and validation that declared target relationships match actual build behavior.
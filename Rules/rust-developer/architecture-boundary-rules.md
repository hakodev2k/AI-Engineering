# Architecture Boundaries

## Purpose
Preserve dependency direction, cohesion, and change isolation in Rust codebases.

## Scope
Crates, modules, domain boundaries, adapters, ports, and public dependency surfaces.

## MUST
- Dependency direction MUST follow documented architectural boundaries.
- Domain logic MUST remain independent of infrastructure details when the architecture requires that separation.
- Cross-boundary data contracts MUST be explicit and reviewed for coupling.
- Significant boundary changes MUST document trade-offs, migration impact, and operational consequences.

## MUST NOT
- MUST NOT create cyclic conceptual dependencies hidden behind traits, globals, or shared utility crates.
- MUST NOT place unrelated responsibilities into common crates solely for convenience.
- MUST NOT bypass domain invariants from infrastructure adapters.

## SHOULD
- Keep crate boundaries aligned with ownership, release, compile-time, and stability needs.
- Prefer small explicit interfaces over broad shared context objects.

## Exceptions
Boundary violations require rationale, risk, alternatives, expiry/remediation plan when temporary, and senior approval.

## Verification
Use dependency graphs, architecture tests where practical, public API review, and change-impact analysis in pull requests.
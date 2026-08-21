# Architecture Boundary Rules

## Purpose
Protect dependency direction, module ownership, domain boundaries, and long-term changeability.

## Scope
Applies to backend modules, application/domain/infrastructure boundaries, shared libraries, and integration seams.

## MUST
- Module and layer responsibilities MUST be explicit enough that reviewers can determine where new behavior belongs.
- Domain/business policy MUST NOT depend directly on transport, persistence, or vendor-specific infrastructure unless the architecture intentionally accepts that coupling.
- Cross-module access MUST use defined contracts rather than reaching into another module's internal persistence or implementation details.
- New shared abstractions MUST solve demonstrated reuse or boundary needs rather than speculative future reuse.
- Significant architecture changes MUST document constraints, alternatives, trade-offs, migration impact, and operational consequences.
- Public contracts between modules MUST have clear ownership and compatibility expectations.

## MUST NOT
- MUST NOT introduce circular dependencies between modules.
- MUST NOT bypass application/domain boundaries merely to reduce short-term implementation effort when doing so creates hidden coupling.
- MUST NOT apply Clean Architecture, DDD, CQRS, or similar patterns mechanically when complexity is not justified.

## SHOULD
- Prefer cohesive modules with high internal cohesion and narrow external contracts.
- Keep infrastructure replaceable where replacement risk or testability materially benefits from it.

## Exceptions
Boundary violations require documented reason, scope, technical debt owner, risk, and intended remediation or explicit acceptance.

## Verification
Use dependency inspection, architecture tests where useful, code review, module contract tests, and design/ADR review for significant changes.
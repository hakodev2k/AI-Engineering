# Architecture Boundary Rules

## Purpose
Protect frontend module boundaries, dependency direction, and long-term maintainability as the React application grows.

## Scope
Applies to feature modules, shared libraries, application shell, domain-facing client logic, routing boundaries, and cross-cutting infrastructure.

## MUST
- Feature ownership and public module entry points MUST be explicit enough that consumers do not depend on internal implementation details.
- Dependency direction MUST prevent low-level shared primitives from depending on feature-specific modules.
- Cross-feature communication MUST use intentional contracts rather than hidden shared mutable state.
- New abstractions spanning multiple features MUST be justified by demonstrated common behavior and stable semantics.
- Architecture changes with broad blast radius MUST document constraints, trade-offs, affected consumers, migration path, and verification evidence.
- Client-side domain rules that affect business correctness MUST remain consistent with server authority and MUST NOT create an independent conflicting source of truth.

## MUST NOT
- MUST NOT introduce circular module dependencies as a normal coordination mechanism.
- MUST NOT create generic shared layers that simply relocate unrelated feature code.
- MUST NOT bypass established boundaries with deep imports or global event mechanisms merely for convenience.
- MUST NOT adopt architectural patterns solely because they are fashionable or used by another project.

## SHOULD
- Prefer feature-oriented boundaries with narrow public surfaces.
- Prefer duplication of small unstable code over premature cross-feature abstractions when requirements are still diverging.
- Prefer architecture enforcement through lint rules, dependency checks, or tests where practical.

## Exceptions
A temporary boundary violation requires a documented reason, affected modules, expected lifetime, risk, remediation plan, and reviewer approval.

## Verification
Use dependency graph inspection, architecture/lint rules, repository search for deep imports, circular-dependency detection, code review, and tests around public module contracts.
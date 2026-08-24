# Application Architecture Rules

## Purpose
Protect Android module boundaries, state ownership, and long-term changeability.

## Scope
Applies to application layers, modules, dependency direction, domain boundaries, and cross-feature contracts.

## MUST
- Define one authoritative owner for each mutable application state.
- Keep platform/UI concerns from becoming implicit dependencies of domain logic unless the domain is inherently platform-specific.
- Make cross-module contracts explicit and backward-compatible when independently consumed.
- Document material architecture changes with constraints, alternatives, operational impact, and migration strategy.
- Keep dependency direction enforceable by build/module boundaries where practical.

## MUST NOT
- Introduce global mutable state as an undocumented coordination mechanism.
- Couple unrelated features through concrete implementation details.
- Add abstraction layers without a demonstrated boundary, volatility, testability, or ownership benefit.

## SHOULD
- Organize boundaries around cohesive capabilities rather than arbitrary technical folders.
- Prefer dependency inversion at volatile external boundaries.
- Keep architecture proportional to product scale and team needs.

## Exceptions
Boundary violations require a time-bounded rationale, risk assessment, and remediation or explicit acceptance.

## Verification
Inspect dependency graphs, module APIs, architecture tests where available, change diffs, and ADRs for significant decisions.
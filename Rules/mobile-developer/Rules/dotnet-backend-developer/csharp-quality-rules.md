# C# Quality Rules

## Purpose
Define Senior-level rules for producing maintainable, predictable, and reviewable C# code.

## Scope
Applies to production C# code, shared libraries, application services, background workers, and public/internal APIs.

## MUST
- Public behavior MUST be explicit through clear types, contracts, nullability, and documented side effects.
- Nullable reference types MUST be respected; warnings affecting correctness MUST be resolved or explicitly justified.
- Exceptions MUST preserve diagnostic context and be translated only at intentional boundaries.
- Resource ownership MUST be clear; disposable resources MUST be disposed by the owning scope.
- Changes to shared abstractions MUST include impact analysis for callers and tests.
- Complex logic MUST be decomposed around cohesive responsibilities rather than arbitrary line-count limits.

## MUST NOT
- MUST NOT suppress compiler warnings broadly to hide correctness problems.
- MUST NOT use reflection, dynamic dispatch, global mutable state, or static service locators without a documented need and review.
- MUST NOT catch `Exception` only to ignore, log-and-rethrow incorrectly, or convert failures into success.
- MUST NOT introduce clever syntax that reduces readability for normal maintenance tasks.

## SHOULD
- Prefer immutable data and explicit state transitions when they reduce accidental mutation.
- Prefer language/runtime features supported by the project target framework and team tooling.
- Prefer composition over inheritance unless substitutability and stable hierarchy are demonstrated.

## Exceptions
A deviation requires the reason, affected scope, considered alternatives, risk, and verification evidence. High-impact deviations require reviewer approval.

## Verification
Use compiler diagnostics, analyzers, code review, unit tests, mutation-sensitive tests where useful, and diff inspection. Reviewers should verify nullability, exception behavior, resource ownership, and compatibility of shared contracts.
# Apex Quality Rules

## Purpose
Define maintainable, reviewable Apex standards for production Salesforce systems.

## Scope
Applies to Apex classes, services, controllers, domain logic, schedulables, batch jobs, queueables, and shared libraries.

## MUST
- Apex code MUST separate business logic from transport, trigger, and UI concerns.
- Public methods MUST define clear input, output, and failure semantics.
- Error handling MUST preserve diagnostic context and distinguish expected business failures from unexpected platform failures.
- Shared logic MUST be centralized when duplication would create divergent behavior or policy drift.
- Changes to behavior with production impact MUST include regression tests.

## MUST NOT
- MUST NOT silently swallow exceptions.
- MUST NOT encode environment-specific IDs or secrets in source.
- MUST NOT introduce hidden side effects in utility methods advertised as read-only.

## SHOULD
- Cohesion SHOULD be preferred over generic helper classes.
- Refactors SHOULD reduce coupling without changing behavior unless behavior change is explicitly approved.

## Exceptions
Exceptions require documented rationale, affected scope, risk, and reviewer approval.

## Verification
Use static analysis, code review, unit tests, dependency inspection, and diff review.
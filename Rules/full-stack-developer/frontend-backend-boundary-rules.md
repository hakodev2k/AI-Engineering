# Frontend–Backend Boundary Rules

## Purpose
Protect clear ownership and contracts across browser, server, and shared concerns.

## Scope
UI, APIs, server logic, shared models, and cross-layer changes.

## MUST
- Keep authorization and business invariants enforceable on the server regardless of client behavior.
- Define explicit contracts between frontend and backend, including validation, errors, nullability, and compatibility expectations.
- Assign each business rule a canonical enforcement location and document intentional duplication.
- Review cross-layer changes for coupling, deployment order, and rollback impact.

## MUST NOT
- Trust client-side validation as a security boundary.
- Couple UI components directly to persistence schemas.
- Duplicate business rules across layers without a consistency strategy.

## SHOULD
- Prefer independently testable boundaries and generated or validated contracts where appropriate.

## Exceptions
Tactical duplication requires documented rationale, synchronization risk, and removal or ownership plan.

## Verification
Review dependency direction, API schemas, tests, and deployment compatibility evidence.
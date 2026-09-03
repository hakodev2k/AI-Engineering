# Resolver Boundary Rules

## Purpose
Keep resolver responsibilities explicit, testable, and operationally safe.

## Scope
Applies to field resolvers, query and mutation entry points, resolver composition, and service boundaries.

## MUST
- Resolvers MUST orchestrate domain operations rather than embed substantial business logic.
- Resolver inputs MUST be validated before invoking downstream services.
- Resolver dependencies MUST be explicit and injectable where the framework permits.
- Resolver behavior MUST preserve authorization and data-ownership boundaries.
- Expensive downstream work MUST expose timeout, cancellation, and failure behavior.

## MUST NOT
- MUST NOT perform hidden cross-service fan-out that bypasses established service interfaces.
- MUST NOT duplicate business rules already owned by domain services.
- MUST NOT swallow downstream failures or convert them into misleading success responses.

## SHOULD
- SHOULD keep resolvers thin enough to unit test without full infrastructure.
- SHOULD reuse shared orchestration utilities only when their semantics are truly common.

## Exceptions
Exceptions require documented rationale, ownership, performance impact, and verification evidence.

## Verification
Review resolver diffs, unit tests, dependency graphs, authorization tests, timeout behavior, and trace spans for unexpected fan-out.
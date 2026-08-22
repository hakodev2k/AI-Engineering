# TypeScript Quality Rules

## Purpose
Use TypeScript's type system to make Angular contracts explicit without creating false runtime safety.

## Scope
Application types, strictness, nullability, narrowing, generics, API models, and unsafe casts.

## MUST
- Preserve strict type checking unless a documented project constraint requires a narrower exception.
- Model null/undefined states intentionally at component, service, and API boundaries.
- Narrow unknown external values before relying on their shape at runtime.
- Keep exported types stable or explicitly migrate consumers when contracts change.

## MUST NOT
- Use `any`, non-null assertions, or broad casts merely to silence a type error whose invariant is unproven.
- Treat TypeScript interfaces as runtime validation for network, storage, or user-controlled data.
- Duplicate domain types with incompatible semantics under similar names.

## SHOULD
- Prefer discriminated unions and exhaustive handling for state machines and result variants when they improve correctness.

## Exceptions
A localized unsafe cast is acceptable when the runtime invariant is proven externally and the reason is documented near the boundary.

## Verification
Run strict compilation/static analysis, inspect unsafe assertions, review exported contracts, and test runtime boundaries.
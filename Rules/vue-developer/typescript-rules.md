# TypeScript Rules

## Purpose
Use TypeScript to protect Vue contracts and refactoring without creating false safety.

## Scope
Vue SFC typing, props/emits, composables, stores, API models, and strictness.

## MUST
- Public component, composable, and store contracts MUST have useful static types.
- Unsafe external data MUST be validated or narrowed at trust boundaries before business use.
- Type assertions that bypass compiler evidence MUST be locally justified when correctness is non-obvious.
- Nullability and optionality MUST reflect runtime reality.
- Type errors in production code MUST block normal release pipelines.

## MUST NOT
- `any` MUST NOT be used to silence unresolved contract problems in critical paths.
- Type assertions MUST NOT substitute for runtime validation of untrusted API, storage, or user data.
- Generated or inferred types MUST NOT be assumed semantically correct without matching runtime contracts.

## SHOULD
- Enable strong compiler settings appropriate to the codebase and improve strictness incrementally when migrating legacy applications.
- Prefer discriminated unions for meaningful UI states over unrelated boolean combinations.

## Exceptions
Temporary escape hatches require a bounded migration reason and should be tracked when they mask material risk.

## Verification
Run `vue-tsc` or equivalent type checking, inspect unsafe casts/any usage, and test runtime validation at external boundaries.
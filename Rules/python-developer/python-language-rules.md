# Python Language Rules
## Purpose
Keep Python behavior explicit, portable, and reviewable.
## Scope
Production Python code and libraries.
## MUST
- Target Python versions MUST be declared and enforced in CI.
- Public interfaces MUST use stable semantics and type information where practical.
- Resource ownership and cleanup MUST be explicit.
## MUST NOT
- MUST NOT depend on implementation quirks without documenting the constraint.
- MUST NOT use mutable default arguments for shared state.
## SHOULD
- Prefer standard-library constructs when they reduce dependency and maintenance risk.
## Exceptions
Exceptions require documented compatibility need, risk, and tests.
## Verification
Run supported interpreters, type/static checks, tests, and code review.
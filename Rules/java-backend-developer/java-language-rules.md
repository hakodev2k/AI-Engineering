# Java Language Rules

## Purpose
Establish production-grade Java practices that preserve correctness, maintainability, and predictable runtime behavior.

## Scope
Applies to Java application code, shared libraries, and backend services.

## MUST
- Code MUST target the project-approved Java version and compiler settings.
- Public types and methods MUST expose intentional contracts, including nullability and failure behavior where relevant.
- Equality, hashing, ordering, and immutability semantics MUST remain mutually consistent.
- Resource-owning objects MUST be closed deterministically, normally with try-with-resources.
- Changes using reflection, serialization, records, sealed types, or pattern matching MUST consider compatibility and framework behavior.

## MUST NOT
- MUST NOT use mutable global state to bypass dependency or lifecycle design.
- MUST NOT catch `Throwable` or broad exceptions merely to suppress failures.
- MUST NOT rely on unspecified iteration order, default charset, default locale, or default timezone when correctness depends on them.

## SHOULD
- Prefer immutable value objects and explicit domain types over primitive-heavy APIs.
- Prefer language constructs that make invalid states harder to represent.
- Keep APIs small enough that ownership and invariants are reviewable.

## Exceptions
Deviations require a documented compatibility or performance reason, alternatives considered, risk, and verification evidence.

## Verification
Use compiler warnings, static analysis, unit tests, API review, and targeted runtime tests. Review diffs for implicit defaults, resource leaks, mutable shared state, and contract changes.
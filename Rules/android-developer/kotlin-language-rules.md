# Kotlin Language Rules

## Purpose
Establish safe, maintainable Kotlin practices for production Android code.

## Scope
Applies to Kotlin source owned by an Android application or library team.

## MUST
- Model nullable state explicitly and resolve nullability at system boundaries.
- Use sealed types or equivalent closed models when callers must handle every domain state.
- Keep side effects visible in APIs; functions that perform I/O or mutate durable state MUST be distinguishable from pure transformations.
- Preserve exception causes when translating failures across abstraction boundaries.
- Treat compiler warnings, static-analysis findings, and unsafe casts affecting correctness as review items.

## MUST NOT
- Use `!!` where absence is a valid runtime state or can originate from external data.
- Hide blocking I/O behind APIs that appear computational or non-blocking.
- Use unchecked casts to bypass a type-modeling problem without documented evidence and tests.
- Catch `Throwable` or broad exceptions merely to continue execution.

## SHOULD
- Prefer immutable values and explicit state transitions.
- Prefer domain types over primitive strings or integers when invalid combinations are costly.
- Keep extension functions close to the domain they clarify and avoid extensions that conceal surprising side effects.

## Exceptions
An exception requires a documented constraint, alternatives considered, risk, and focused verification. Safety-critical deviations require reviewer approval.

## Verification
Use Kotlin compiler checks, configured lint/static analysis, unit tests for boundary cases, and code review of nullability, casts, mutation, and exception flow.
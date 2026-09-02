# Instrumentation Standard Rules

## Purpose
Ensure tracing is consistent, maintainable, and comparable across services.

## Scope
Applies to automatic and manual instrumentation, semantic conventions, libraries, and instrumentation ownership.

## MUST
- Instrumentation MUST follow the project-approved semantic conventions for service, operation, network, database, messaging, and error attributes.
- Manual spans MUST represent meaningful operations that cannot be inferred reliably from automatic instrumentation.
- Instrumentation libraries MUST be versioned and reviewed like production dependencies.
- Service teams MUST know which spans are produced automatically before adding custom spans.

## MUST NOT
- MUST NOT duplicate automatic spans merely to rename them.
- MUST NOT introduce custom attribute names where an adopted standard already defines equivalent semantics.
- MUST NOT instrument trivial code paths when the added telemetry has no diagnostic value.

## SHOULD
- Shared instrumentation SHOULD be centralized in reusable libraries when semantics are stable across services.
- Instrumentation ownership SHOULD be explicit for critical services.

## Exceptions
Exceptions require a documented semantic gap, compatibility concern, and migration plan if a custom convention is introduced.

## Verification
Review emitted spans in representative traffic, compare attributes against adopted conventions, inspect dependency versions, and test library upgrades in CI.

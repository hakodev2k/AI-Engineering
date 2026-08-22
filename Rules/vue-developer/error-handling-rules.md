# Error Handling Rules

## Purpose
Make failures diagnosable, recoverable where possible, and safe for users.

## Scope
Rendering errors, API failures, lazy loading, global handlers, user messages, and recovery.

## MUST
- Expected business failures MUST be represented separately from unexpected technical failures.
- User-facing errors MUST explain actionable next steps when recovery is possible without exposing sensitive internals.
- Unexpected failures MUST preserve diagnostic context through approved logging/telemetry.
- Critical application regions MUST define an appropriate recovery boundary so one failure does not unnecessarily destroy the entire session.
- Repeated failure loops MUST be prevented for retries, navigation, and error recovery.

## MUST NOT
- Exceptions or rejected promises MUST NOT be silently swallowed.
- Raw stack traces, tokens, internal endpoints, or sensitive payloads MUST NOT be shown to end users.
- Generic global handlers MUST NOT hide failures that local code is responsible for resolving.

## SHOULD
- Provide correlation identifiers when they materially help support investigation.
- Preserve safe user state across recoverable errors.

## Exceptions
Best-effort noncritical telemetry may fail silently only if failure cannot affect application behavior and diagnostics are unnecessary by design.

## Verification
Inject network/render failures, inspect user states and telemetry, and test recovery without reload where promised.
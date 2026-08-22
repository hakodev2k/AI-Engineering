# Error and Recovery UX Rules
## Purpose
Make failures understandable, safe, and recoverable without hiding diagnostic evidence.
## Scope
Error boundaries, request failures, validation failures, degraded states, and recovery actions.
## MUST
- User-facing failures MUST communicate what happened at an appropriate level and what action is possible.
- Unexpected errors MUST preserve diagnostic correlation without exposing sensitive internals.
- Critical screens MUST define containment so one failing region does not unnecessarily destroy unrelated work.
- Retry actions MUST be safe for the underlying operation.
- Recoverable user input MUST be preserved across failures where practical.
## MUST NOT
- Exceptions MUST NOT be silently swallowed while presenting false success.
- Raw stack traces, secrets, or internal identifiers MUST NOT be exposed as user guidance.
## SHOULD
- Provide degraded read-only behavior when it safely preserves useful functionality.
## Exceptions
Security-sensitive failures may intentionally provide less detail to users while retaining internal evidence.
## Verification
Failure injection, error-boundary tests, network fault tests, telemetry inspection, and recovery E2E tests.
# Error Handling Rules

## Purpose
Preserve diagnosability and stable failure semantics across WebAssembly boundaries.

## Scope
Applies to traps, typed errors, host failures, guest failures, panics, and process-level containment.

## MUST
- Expected domain failures MUST use explicit error contracts rather than traps.
- Unexpected traps MUST be captured with enough context to diagnose the failing module and operation.
- Error translation across boundaries MUST preserve actionable categories such as invalid input, denied capability, timeout, exhaustion, and internal failure.
- Sensitive implementation details MUST be redacted from untrusted callers.
- Recovery behavior after a trap MUST be defined for the runtime and instance lifecycle.

## MUST NOT
- Unexpected errors MUST NOT be silently swallowed.
- A trap MUST NOT automatically be retried when the operation may have produced side effects.
- Guest-facing errors MUST NOT include secrets, credentials, private host paths, or unrelated tenant data.
- All failures MUST NOT be collapsed into one generic code when callers need distinct recovery behavior.

## SHOULD
- Attach correlation identifiers to cross-boundary failures.
- Preserve original diagnostic causes in trusted telemetry.
- Test malformed input, denied capabilities, exhaustion, and host failure separately.

## Exceptions
Deliberately opaque public errors are acceptable for security reasons if trusted diagnostics retain sufficient detail.

## Verification
Review error mappings, execute fault-injection tests, inspect logs for correlation and redaction, and confirm trap recovery does not leave corrupted or reusable invalid state.
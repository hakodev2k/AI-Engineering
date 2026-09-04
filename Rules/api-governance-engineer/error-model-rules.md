# Error Model Rules

## Purpose
Provide predictable, diagnosable, and safe failure contracts across APIs.

## Scope
Applies to synchronous API errors and asynchronous operation failure representations.

## MUST
- APIs MUST define a stable machine-readable error identifier separately from human-readable text.
- Errors MUST distinguish client-correctable conditions from server or dependency failures.
- Validation errors MUST identify the invalid input location without exposing sensitive internals.
- Correlation or trace identifiers SHOULD be returned when they safely help support investigation.
- Retry guidance MUST be explicit when retries are safe and relevant.

## MUST NOT
- Stack traces, secrets, internal SQL, infrastructure topology, or sensitive personal data MUST NOT appear in public error responses.
- Clients MUST NOT be required to parse free-form prose to identify a documented error condition.
- The same error code MUST NOT represent materially different semantics.

## SHOULD
- Error models SHOULD be reused consistently across an API portfolio.
- Human-readable messages SHOULD be useful but MUST NOT be the compatibility key.

## Exceptions
Exceptions require protocol or domain justification, security review when disclosure changes, and documented consumer handling.

## Verification
Inspect specifications, negative-path tests, production samples, security tests, and client behavior. Confirm identifiers are stable and sensitive implementation details are absent.
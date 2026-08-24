# Input Validation Rules

## Purpose
Prevent malformed, unsafe, or semantically invalid input from reaching trusted application logic.

## Scope
API requests, messages, files, webhook payloads, query parameters, configuration input, and external integration data.

## MUST
- Untrusted input MUST be validated at trust boundaries before use.
- Validation MUST cover type, range, format, size, required relationships, and business invariants where applicable.
- Validation failures MUST return deterministic, non-sensitive errors.
- File and payload size limits MUST be enforced before expensive processing.

## MUST NOT
- MUST NOT rely on client-side validation for server safety.
- MUST NOT deserialize untrusted polymorphic input into arbitrary runtime types.
- MUST NOT pass unchecked input into SQL, shell commands, templates, or dynamic code execution.

## SHOULD
- Validation SHOULD be centralized enough to avoid contradictory rules while remaining close to the boundary.
- Reject invalid input early to conserve resources.

## Exceptions
Deferred validation requires explicit justification, bounded risk, and downstream guarantees.

## Verification
Review validators, negative tests, fuzz/property tests, payload limits, injection tests, and boundary integration tests.
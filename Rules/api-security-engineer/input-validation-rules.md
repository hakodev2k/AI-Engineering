# Input Validation Rules

## Purpose
Prevent hostile or malformed API input from crossing trust boundaries unchecked.

## Scope
Headers, paths, queries, bodies, files, metadata, callbacks, and protocol fields.

## MUST
- Validate type, structure, length, range, format, allowed values, and business constraints before trusted processing.
- Use allowlists where the valid domain is enumerable.
- Apply canonicalization consistently before security-sensitive comparison.
- Bound nested structures, collections, and payload sizes.

## MUST NOT
- Treat schema validation alone as sufficient for business or authorization constraints.
- Build executable queries, commands, or templates by concatenating untrusted input.

## SHOULD
- Reject invalid input early with stable errors that do not expose sensitive internals.

## Exceptions
Permissive fields require a documented reason and downstream-safe handling strategy.

## Verification
Run schema tests, fuzzing, injection tests, boundary-value tests, static analysis, and code review of trust-boundary parsing.
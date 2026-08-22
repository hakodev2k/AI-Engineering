# Input Validation and Error Design

## Purpose
Create predictable validation and error behavior that protects invariants and helps consumers recover correctly.

## When to use
Use for endpoint implementation, contract design, and error-standard reviews.

## Inputs
Request schema, business rules, error conventions, localization needs, and observability requirements.

## Context to inspect
Validation layers, exception handling, status mappings, correlation IDs, and existing error payloads.

## Core knowledge
Separate malformed input, domain-rule rejection, authentication failure, authorization denial, conflict, absence, throttling, and unexpected server failure. Do not expose stack traces or secrets.

## Procedure
1. Define syntactic and semantic validation.
2. Validate at the earliest trustworthy boundary.
3. Map failure categories to stable HTTP statuses.
4. Define machine-readable error codes.
5. Add safe human-readable detail and field errors.
6. Include correlation metadata where appropriate.
7. Centralize unexpected exception mapping.
8. Test invalid, boundary, and malicious inputs.

## Decision points
Use 400 for malformed/invalid requests, 409 for state conflicts when meaningful, and domain-specific codes inside a stable error envelope.

## Common failure patterns
Always returning 200, leaking internals, inconsistent error shapes, validation duplicated across layers, and ambiguous free-text-only errors.

## Verification
Negative tests assert status, code, schema, and absence of sensitive information.

## Expected output
A consistent validation and error-handling contract.

## Stop conditions
Escalate when domain invariants or public error compatibility are unclear.
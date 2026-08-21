# Input Validation and Secure Coding

## Purpose
Reduce exploitable behavior by validating untrusted input, constraining dangerous operations, and following secure-by-default backend patterns.

## When to use
Any endpoint/file/upload/import/query feature, dynamic SQL, serialization, outbound URL handling, or security-sensitive review.

## Inputs
API contracts, trust boundaries, storage/command paths, validation rules, security requirements.

## Context to inspect
Model binding, validators, SQL construction, file paths, URL fetches, deserialization, logging, error responses.

## Core knowledge
Validate type/range/shape/business rules; parameterize SQL; prevent path traversal and SSRF; avoid unsafe deserialization; encode at output boundaries; do not expose secrets in logs/errors.

## Procedure
1. Enumerate untrusted inputs and sinks.
2. Apply syntactic constraints early.
3. Apply business validation at the domain/application boundary.
4. Parameterize database commands.
5. Allow-list external destinations/file types where feasible.
6. Limit payload sizes and parsing complexity.
7. Avoid logging credentials/tokens/sensitive payloads.
8. Return safe structured errors.
9. Add abuse-case tests.

## Decision points
Prefer allow-lists for security-sensitive finite domains. Reject ambiguous input rather than trying to repair it silently.

## Common failure patterns
String-concatenated SQL, trusting MIME/extensions, unrestricted URL fetches, overposting, mass assignment, secrets in logs, detailed stack traces to clients.

## Verification
Negative tests, security scanning where available, manual sink review, payload-limit tests.

## Expected output
Constrained input flows with safe sinks and predictable errors.

## Stop conditions
Escalate suspected vulnerability exposure or changes involving cryptography/key handling.
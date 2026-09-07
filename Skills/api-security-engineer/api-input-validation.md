# API Input Validation

## Purpose
Design and verify server-side validation so malformed, ambiguous, oversized, or malicious input cannot reach sensitive business logic or downstream interpreters.

## When to use
Use for new or changed endpoints, schema migrations, file uploads, filters, sorting, search, dynamic queries, and integrations accepting third-party payloads.

## Inputs
API schemas, validation rules, business constraints, downstream data stores, parser behavior, payload limits, error contracts.

## Preconditions
Separate syntactic validation, semantic validation, authorization, and business invariants.

## Context to inspect
Path/query/body parameters, headers, multipart fields, JSON/XML parsers, deserializers, dynamic SQL/search construction, URL fetches, templates, and file processing.

## Core knowledge
Validate allowlisted shapes, types, lengths, ranges, formats, enumerations, and cross-field rules. Normalization must be deterministic. Validation does not replace parameterization, output encoding, or authorization.

## Procedure
1. Inventory every untrusted field.
2. Define canonical representation and constraints.
3. Reject unknown or duplicate fields where ambiguity is risky.
4. Enforce size and nesting limits before expensive processing.
5. Validate semantic relationships after parsing.
6. Parameterize downstream queries and commands.
7. Avoid implicit type coercion that changes meaning.
8. Return stable, non-sensitive validation errors.
9. Add fuzz, boundary, malformed, and oversized test cases.
10. Observe rejection rates for abuse signals.

## Decision points
Prefer strict schemas for machine-to-machine APIs; tolerate forward-compatible unknown fields only when contract strategy requires it. Normalize before comparison only when normalization semantics are well defined.

## Common failure patterns
Client-only validation, regex-only security, permissive deserialization, unsafe type coercion, unbounded arrays, injection through secondary interpreters, and inconsistent validation across API versions.

## Verification
Run schema tests, boundary tests, malformed payload tests, injection probes, and payload-limit tests. Confirm invalid input never causes sensitive side effects.

## Expected output
A documented validation boundary with enforceable constraints, tests, and safe error behavior.

## Stop conditions
Escalate when requirements conflict with secure limits, downstream parser behavior is unknown, or accepted legacy input cannot be normalized safely.
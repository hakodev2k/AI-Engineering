# Input Validation and Output Encoding

## Purpose
Prevent untrusted data from crossing syntax or semantic boundaries unsafely.

## When to use
Use for APIs, forms, parsers, templating, file processing, command execution, dynamic queries, and integration payloads.

## Inputs
Data contracts, parser code, sinks, serializers, templates, validation rules, and representative malicious inputs.

## Context to inspect
Trace data from source to sink. Identify SQL, shell, HTML, JavaScript, URL, LDAP, template, filesystem, and deserialization contexts.

## Core knowledge
Validation enforces domain constraints; encoding/parameterization makes data safe for a specific interpreter. Allowlists are preferred where domains are bounded. Canonicalization order matters.

## Procedure
1. Inventory untrusted inputs including headers, filenames, metadata, and upstream service data.
2. Define type, length, range, format, and business invariants at trust boundaries.
3. Locate interpreter sinks.
4. Replace string construction with parameterized or structured APIs.
5. Apply context-specific output encoding at the final rendering boundary.
6. Normalize only when semantics require it; validate after relevant canonicalization.
7. Bound parser depth, collection size, and payload size.
8. Add adversarial tests for metacharacters, Unicode, truncation, and malformed structures.

## Decision points
Reject invalid data when correctness matters; sanitize only when preserving partially valid content is a requirement. Prefer safe APIs over escaping handcrafted strings.

## Common failure patterns
Regex-only security, validating one representation then using another, double encoding, blacklist filters, and assuming JSON parsing prevents injection.

## Verification
Confirm dangerous sinks receive structured parameters or correctly encoded values and run negative tests through production-equivalent parsers.

## Expected output
Validated boundaries, safe sink usage, tests, and documented exceptional sanitization.

## Stop conditions
Escalate when required legacy behavior depends on unsafe syntax construction or input semantics are undefined.
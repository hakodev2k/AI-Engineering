# Application Security Review

## Purpose
Review application behavior and code-level security controls for vulnerabilities that architecture alone cannot prevent.

## When to use
Use before releasing sensitive features, after major refactoring, when introducing new frameworks or libraries, or when security defects recur.

## Inputs
Repository, architecture, threat model, routes/endpoints, authorization rules, validation logic, dependency inventory, test results.

## Context to inspect
Request parsing, authorization, file handling, deserialization, template rendering, database access, outbound calls, error handling, logging, and security headers.

## Core knowledge
Application security failures commonly emerge at trust boundaries: injection, broken access control, unsafe deserialization, SSRF, path traversal, insecure file handling, XSS, CSRF, and information leakage. Review actual data flow and framework defaults.

## Procedure
1. Identify externally influenced inputs and privileged operations.
2. Trace input through validation, transformation, storage, and output.
3. Verify authorization on every protected server-side action.
4. Review query construction and command execution for injection paths.
5. Check outbound requests against SSRF and allowlist requirements.
6. Review file paths, uploads, downloads, and content-type handling.
7. Inspect serialization/deserialization and template rendering.
8. Validate error responses and logs do not expose secrets or sensitive internals.
9. Review security headers, CSRF controls, cookie settings, and browser-facing protections where applicable.
10. Add focused regression tests for confirmed risks.

## Decision points
Use framework-provided security primitives when they are mature and correctly configured. Introduce custom security code only when required and test it heavily.

## Common failure patterns
Client-side-only validation, endpoint authorization gaps, string-built SQL or shell commands, unrestricted URL fetches, trusting file extensions, verbose production errors, and disabling framework protections to simplify development.

## Verification
Security-focused tests cover identified attack paths, access-control negatives, malicious inputs, and error behavior. Static and dynamic analysis findings are triaged with evidence.

## Expected output
A prioritized application-security review with reproducible findings, remediations, regression tests, and residual risk.

## Stop conditions
Escalate when testing would affect production, require destructive payloads, or involve credentials/data outside the approved scope.
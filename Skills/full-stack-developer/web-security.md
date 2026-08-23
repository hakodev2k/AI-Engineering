# Web Security

## Purpose
Reduce exploitable web vulnerabilities across UI, API, storage, and integrations.

## When to use
Feature design, code review, security hardening, dependency changes, or handling untrusted input.

## Inputs
Data flows, endpoints, browser behavior, dependencies, deployment configuration, threat model.

## Context to inspect
Input handling, output encoding, headers, cookies, CORS, uploads, redirects, SSRF surfaces, dependency versions, secret handling.

## Core knowledge
Treat all external input as untrusted. Prevent injection through contextual encoding and parameterization; constrain capabilities; minimize exposed data; use layered controls rather than blacklist filtering.

## Procedure
1. Identify trust boundaries and sensitive assets.
2. Trace untrusted input to interpreters and privileged operations.
3. Validate structure and business constraints server-side.
4. Parameterize database operations.
5. Encode output for its rendering context.
6. Harden cookies, headers, CORS, and CSRF defenses.
7. Validate uploads, URLs, and redirects.
8. Review dependency and secret exposure.
9. Test abuse cases and authorization bypasses.
10. Add monitoring for relevant attack signals.

## Decision points
Sanitize only when rich untrusted content must be preserved; otherwise encode or reject. Add browser security policies according to application compatibility and threat model.

## Common failure patterns
Regex-only validation, client-only checks, unsafe HTML rendering, permissive CORS, exposed secrets, vulnerable dependencies, SSRF through URL fetchers, and detailed production errors.

## Verification
Run focused security tests and dependency scans; verify headers, cookies, negative inputs, injection payloads, and access controls.

## Expected output
Documented mitigations with evidence that critical abuse paths are blocked.

## Stop conditions
Escalate suspected active compromise or unresolved high-severity exposure.
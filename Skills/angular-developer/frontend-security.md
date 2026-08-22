# Frontend Security

## Purpose
Reduce browser-side security risk through safe rendering, dependency hygiene, trust-boundary awareness, and secure integration practices.

## When to use
Use during feature development, security review, third-party integration, or when handling untrusted content.

## Inputs
Templates, DOM usage, external content, dependencies, CSP configuration, API behavior, and threat model.

## Context to inspect
Inspect sanitization bypasses, innerHTML, URLs, storage, postMessage, third-party scripts, dependencies, and sensitive data exposure.

## Core knowledge
Angular escaping reduces common XSS but explicit trust bypasses can reintroduce it. Browser code and shipped configuration are observable by users. CSP and server controls provide defense in depth.

## Procedure
1. Identify untrusted data sources and sensitive data.
2. Trace untrusted values into DOM and URL sinks.
3. Remove unnecessary sanitizer bypasses.
4. Validate external navigation and message origins.
5. Minimize browser storage of sensitive values.
6. Review third-party scripts and dependencies.
7. Coordinate CSP and security headers with hosting.
8. Add tests for critical unsafe-input cases.

## Decision points
Sanitize rich content using an appropriate policy rather than trusting arbitrary HTML. Avoid third-party code when its privilege exceeds its value.

## Common failure patterns
Blind bypassSecurityTrust calls, secrets in environment bundles, unsafe innerHTML, trusting postMessage origins, vulnerable dependencies, and exposing sensitive errors.

## Verification
Run security-focused tests/scans, inspect built assets, test malicious inputs, and verify CSP/security headers in deployed environments.

## Expected output
Documented and tested browser security controls.

## Stop conditions
Escalate suspected vulnerabilities, credential exposure, or security-policy changes requiring approval.
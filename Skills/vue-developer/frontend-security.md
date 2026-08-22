# Frontend Security

## Purpose
Reduce security risk in Vue applications by treating browser data, rendering, storage, navigation, and backend interactions as trust boundaries.

## When to use
Use for authentication flows, user-generated content, token handling, third-party scripts, security reviews, and sensitive features.

## Inputs
Threat model, auth design, data flows, CSP/deployment configuration, and application code.

## Context to inspect
Inspect v-html usage, URL handling, storage, cookies, API client, dependency scripts, authorization UX, and server headers.

## Core knowledge
Vue escapes interpolated text by default, but unsafe HTML and URLs remain dangerous. Frontend authorization cannot secure backend resources. XSS can compromise browser-accessible secrets. CSRF risk depends on credential transport.

## Procedure
1. Identify sensitive data and browser trust boundaries.
2. Eliminate unnecessary raw HTML rendering.
3. Sanitize unavoidable untrusted HTML with an appropriate maintained sanitizer.
4. Validate external URLs and navigation targets.
5. Minimize sensitive browser storage.
6. Align cookie/token handling with the authentication model.
7. Ensure server authorization protects every privileged operation.
8. Review CSP and third-party scripts.
9. Scan dependencies and test abuse cases.

## Decision points
Prefer HttpOnly secure cookies when architecture supports them; use browser-accessible tokens only with understood XSS trade-offs. Avoid client-side secrets entirely.

## Common failure patterns
Trusting TypeScript types as validation, v-html on user content, localStorage secrets without threat analysis, frontend-only permissions, open redirects, and embedding credentials in builds.

## Verification
Test XSS-relevant inputs, unauthorized API calls, auth expiry, security headers, dependency findings, and sensitive-data exposure.

## Expected output
Documented controls and secure browser behavior for identified threats.

## Stop conditions
Escalate critical vulnerabilities, unknown auth semantics, or changes requiring security-owner approval.
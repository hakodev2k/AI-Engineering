# Frontend Security

## Purpose
Reduce client-side security risks and prevent React code from weakening system security boundaries.

## When to use
Use for authentication flows, rendering untrusted content, token handling, redirects, uploads, and third-party scripts.

## Inputs
Threat model, auth architecture, content sources, CSP, API behavior, browser storage use.

## Preconditions
Recognize that authorization must be enforced server-side.

## Context to inspect
`dangerouslySetInnerHTML`, URL handling, storage, cookies, iframe/script usage, dependency risk, secrets in builds.

## Core knowledge
Primary risks include XSS, token theft, insecure redirects, CSRF depending on credential model, supply-chain exposure, and accidental secret disclosure.

## Procedure
1. Identify trust boundaries and untrusted inputs.
2. Avoid raw HTML; sanitize with a proven library when unavoidable.
3. Prefer secure HttpOnly cookie/token architecture where applicable.
4. Validate redirect targets and external URLs.
5. Apply CSP and security headers with platform owners.
6. Keep secrets out of client bundles.
7. Review third-party scripts and dependencies.
8. Verify server-side authorization independently of UI state.

## Decision points
Choose browser storage only after evaluating XSS exposure and session requirements.

## Common failure patterns
Treating hidden UI as authorization, storing long-lived tokens insecurely, trusting query params, rendering unsanitized HTML, exposing API keys.

## Verification
Security tests, dependency audit, CSP checks, auth boundary tests, and inspection of production bundles.

## Expected output
Frontend behavior aligned with system threat model.

## Stop conditions
Stop and escalate on suspected credential exposure, XSS, or unclear authentication ownership.
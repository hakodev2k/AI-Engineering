# Deep Links and Navigation

## Purpose
Design deterministic navigation and safely route external links into application state.

## When to use
Navigation architecture, universal/app links, notifications, auth callbacks.

## Inputs
Route map, URL contracts, authentication rules, lifecycle behavior.

## Context to inspect
Navigation stack, intent/URL handlers, startup routing, access control, parameter parsing.

## Core knowledge
External links are untrusted input. Navigation must handle cold start, warm start, expired sessions, invalid destinations, and back-stack semantics.

## Procedure
1. Define canonical destinations and parameters.
2. Validate and normalize external inputs.
3. Map links to internal routes rather than executing arbitrary actions.
4. Gate protected routes on authorization.
5. Preserve intended destination across login when safe.
6. Define cold/warm start behavior.
7. Define back-stack behavior.
8. Test malformed, duplicate, unsupported, and unauthorized links.

## Decision points
Prefer verified HTTPS links for public routing where supported; custom schemes require stronger collision/validation awareness.

## Common failure patterns
Open redirects, unsafe parameters, duplicate screens, bypassing auth, inconsistent back behavior.

## Verification
Automated route tests and real-device link invocation across lifecycle states.

## Expected output
Versioned routing rules with safe validation and predictable navigation.

## Stop conditions
Escalate ambiguous security ownership or incompatible external URL contracts.
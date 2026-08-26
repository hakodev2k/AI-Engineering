# Deep Link Security

## Purpose
Prevent deep links and universal/app links from becoming authorization bypasses, injection vectors, or unsafe navigation entry points.

## When to use
Use for routes, authentication callbacks, marketing links, payment callbacks, or cross-app navigation.

## Inputs
Route inventory, URL schemes, associated-domain configuration, expected parameters, authentication requirements.

## Preconditions
Identify externally invokable routes and privileged operations.

## Context to inspect
Custom schemes, verified links, route parsers, redirect handlers, WebViews, intent filters, associated domains, backend callbacks.

## Core knowledge
External links are untrusted input. Validate destination, parameters, state, authentication, and authorization independently of navigation origin.

## Procedure
1. Inventory externally reachable routes.
2. Prefer verified platform links where feasible.
3. Validate scheme, host, path, types, and destinations.
4. Require server authorization for privileged effects.
5. Bind authentication callbacks to state/nonce where applicable.
6. Reject open redirects and arbitrary URL forwarding.
7. Test malformed, encoded, duplicated, and unexpected parameters.
8. Test unauthenticated and wrong-account states.

## Decision points
Use custom schemes only when verified links cannot meet requirements. Reject unknown inputs rather than using permissive fallback.

## Common failure patterns
Trusting link source, open redirects, auth bypass, unvalidated nested URLs, scheme hijacking, and side effects during navigation.

## Verification
Fuzz route inputs and confirm no unauthorized action, unsafe WebView load, or account-context confusion.

## Expected output
A constrained deep-link surface with explicit validation and negative-path tests.

## Stop conditions
Escalate when associated-domain ownership or callback semantics cannot be verified.
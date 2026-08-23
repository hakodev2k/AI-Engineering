# Client-Side and Browser Security Testing

## Purpose
Assess browser-facing trust boundaries including cross-origin policy, content injection, storage, navigation, framing, and client-to-server assumptions.

## When to use
Use for browser applications, embedded widgets, authentication redirects, cross-origin integrations, and rich client functionality.

## Inputs
Application URLs, supported browsers, test accounts, frontend architecture, origin relationships, and backend scope.

## Context to inspect
Inspect DOM sinks, CSP, CORS, cookies, storage, postMessage, redirects, framing, service workers, third-party scripts, and server-side validation of client-controlled state.

## Core knowledge
Browser controls are contextual. CORS is not authorization, CSP is defense-in-depth, and client state is attacker-controlled. Findings require a realistic origin, execution, or data-access consequence.

## Procedure
1. Map origins, embedded contexts, and third-party script trust.
2. Review cookie and browser storage handling.
3. Test server output and DOM rendering for injection using harmless markers.
4. Evaluate cross-origin resource policy and credential behavior.
5. Test messaging and redirect boundaries.
6. Review framing and sensitive UI interaction protections.
7. Inspect service-worker/cache behavior where relevant.
8. Validate whether client-side controls are backed by server enforcement.
9. Prove impact with controlled data/actions.
10. Recommend fixes at the correct browser/server boundary.

## Decision points
Do not report permissive CORS without a sensitive cross-origin consequence. Treat CSP bypasses as material according to the underlying injection and protected assets.

## Common failure patterns
CORS false positives, reporting self-XSS without realistic victim path, assuming localStorage alone is a vulnerability, and ignoring server authorization.

## Verification
Reproduce in supported browser context and demonstrate the exact origin/execution/data boundary that fails.

## Expected output
Validated browser-security findings with prerequisites, affected origin/control, evidence, impact, and remediation.

## Stop conditions
Stop before targeting real users, third-party origins outside scope, or executing actions with uncontrolled external side effects.
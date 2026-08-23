# Web Application Testing

## Purpose
Assess web applications for exploitable weaknesses across authentication, authorization, input handling, browser security, workflows, and server-side behavior.

## When to use
Use for authorized web applications and web-backed administrative interfaces.

## Inputs
Scope, application URLs, test accounts/roles, architecture, API contracts when available, and business-critical workflows.

## Context to inspect
Inspect routes, forms, APIs, cookies, headers, sessions, file operations, privileged functions, integrations, and client-side behavior.

## Core knowledge
Use OWASP-style categories as coverage guidance, not a checkbox substitute. Business logic and authorization defects often require understanding state and user intent. Automated findings require manual validation.

## Procedure
1. Map reachable functionality by role.
2. Establish normal requests and state transitions.
3. Test authentication and session boundaries.
4. Test object- and function-level authorization.
5. Evaluate server-side input handling and output encoding.
6. Review file upload/download and URL-fetching features.
7. Test browser security controls and cross-origin behavior.
8. Exercise workflow invariants and abuse cases.
9. Validate candidate findings with minimal-impact proof.
10. Record reproducible requests, impact, and remediation guidance.

## Decision points
Prefer harmless payloads that prove control failure. Escalate exploit depth only when additional evidence changes severity or remediation and remains authorized.

## Common failure patterns
Scanner-only testing, testing only happy paths, confusing validation errors with security controls, missing horizontal authorization, overclaiming theoretical impact, and retaining sensitive responses unnecessarily.

## Verification
Reproduce findings independently, compare across roles, verify server-side enforcement, and confirm evidence demonstrates the claimed security boundary failure.

## Expected output
Validated web findings with affected functions, prerequisites, impact, concise reproduction evidence, and remediation direction.

## Stop conditions
Stop destructive payloads, denial-of-service behavior, unapproved data access, or any test that exceeds rules of engagement.
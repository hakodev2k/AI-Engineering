# Security-Focused Testing

## Purpose
Add repeatable security checks to QA automation without pretending to replace specialist penetration testing.

## When to use
Use for authentication, authorization, sensitive data, file handling, APIs, role changes, and externally exposed features.

## Inputs
Threat model, roles/permissions, API/UI contracts, data classification, security requirements.

## Context to inspect
Trust boundaries, identity flows, object ownership, input handling, secrets, session behavior, headers, logs, uploads, and error responses.

## Core knowledge
Prioritize broken access control, authentication/session errors, injection exposure, unsafe input/file handling, sensitive-data leakage, and insecure defaults. Test authorization server-side, not merely hidden UI controls.

## Procedure
1. Identify assets, actors, and trust boundaries.
2. Build role/permission test matrix.
3. Verify unauthenticated, unauthorized, cross-user, and cross-tenant access attempts.
4. Exercise malformed and adversarial inputs safely in non-production environments.
5. Check session expiry/revocation and privilege changes.
6. Verify sensitive data is absent from responses, URLs, logs, and artifacts.
7. Test upload/content restrictions where applicable.
8. Add dependency/configuration scanners to CI when owned by the team.
9. Record high-risk findings with reproducible evidence.

## Decision points
Automate deterministic security invariants; use security specialists for exploit development, deep threat analysis, or regulated penetration testing.

## Common failure patterns
Testing only UI authorization, destructive payloads in shared environments, exposing secrets in test logs, assuming scanners prove security.

## Verification
Demonstrate denied access for prohibited actors and allowed access for intended actors; review artifacts for data leakage.

## Expected output
Automated security regression evidence and clearly escalated specialist findings.

## Stop conditions
Stop before destructive testing, production exploitation, or activities outside explicit authorization.
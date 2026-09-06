# API Security Hardening

## Purpose
Reduce exploitable API attack surface through systematic platform and interface controls.

## When to use
Use during security reviews, new exposure, gateway changes, or remediation of API vulnerabilities.

## Inputs
API inventory, threat model, auth design, schemas, gateway configuration, security requirements.

## Context to inspect
Inspect exposure, authorization, validation, CORS, TLS, headers, payload limits, dependency versions, and sensitive-data flows.

## Core knowledge
API risks include broken object/function authorization, excessive data exposure, injection, resource exhaustion, unsafe consumption of upstream data, and configuration weaknesses. Controls must exist at the correct trust boundary.

## Procedure
1. Inventory exposed operations and sensitive assets.
2. Validate authentication and object/function authorization.
3. Enforce strict input schemas and bounded payloads.
4. Minimize response data.
5. Configure TLS and secure transport policy.
6. Restrict CORS and browser exposure intentionally.
7. Apply resource and abuse controls.
8. Review outbound calls and SSRF protections.
9. Remove debug/admin exposure and unsafe defaults.
10. Add security regression tests and monitoring.

## Decision points
Prefer allowlists where the valid set is known. Use gateway controls for universal transport protections but keep domain authorization in services.

## Common failure patterns
IDOR/BOLA, mass assignment, wildcard CORS, unbounded uploads, trusting client claims, verbose errors, and hidden admin endpoints.

## Verification
Run negative authorization tests, schema fuzzing, configuration review, dependency scans, and targeted security tests.

## Expected output
Documented and verified API hardening controls with residual risks identified.

## Stop conditions
Escalate suspected active compromise, unknown data classification, or changes requiring security approval.
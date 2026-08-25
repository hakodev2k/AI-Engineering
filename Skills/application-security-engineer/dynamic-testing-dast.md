# Dynamic Application Security Testing

## Purpose
Test a running application for exploitable security behavior that depends on runtime configuration, routing, parsing, or integration.

## When to use
Use in staging, pre-release assessments, regression testing, and validation of externally reachable surfaces.

## Inputs
Authorized target, API/schema, test accounts, environment constraints, scanner configuration, and application logs.

## Context to inspect
Confirm scope, environment parity, destructive-operation restrictions, authentication flows, rate limits, and monitoring contacts.

## Core knowledge
DAST observes behavior without full code context. Authenticated coverage and application state strongly affect results. Automated scanning complements, not replaces, manual abuse-case testing.

## Procedure
1. Obtain explicit target scope and safe-testing constraints.
2. Map reachable routes and authenticated roles.
3. Configure crawler/scanner with production-representative headers and sessions.
4. Run non-destructive discovery first.
5. Exercise injection, auth, session, misconfiguration, and information-exposure cases appropriate to the surface.
6. Correlate findings with server logs and code.
7. Reproduce high-impact findings manually with minimal requests.
8. Fix root cause and add deterministic regression tests.
9. Re-test the exact exploit path.

## Decision points
Prefer staging when payloads can mutate state; production testing requires explicit approval and tight safety controls. Scanner severity never overrides validated business impact.

## Common failure patterns
Unauthenticated-only scans, uncontrolled crawling, reporting unverified scanner alerts, and testing environments that differ materially from production.

## Verification
Demonstrate the original request no longer violates the security property and ensure the fix does not merely block one payload string.

## Expected output
Reproducible runtime findings, evidence, remediation, and retest results.

## Stop conditions
Stop immediately on instability, unexpected destructive effects, out-of-scope access, or evidence of an active unrelated incident.
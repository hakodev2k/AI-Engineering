# API Security Review

## Purpose
Systematically review API attack surface and controls before release or after material change.

## When to use
Use for security-sensitive APIs, new external exposure, major authorization changes, and periodic reviews.

## Inputs
API contract, threat model, identity design, data classification, implementation, and deployment topology.

## Context to inspect
Authentication, authorization, validation, CORS, secrets, transport security, rate limits, logging, dependencies, and administrative endpoints.

## Core knowledge
Prioritize broken object-level authorization, broken authentication, excessive data exposure, resource exhaustion, injection, SSRF, unsafe configuration, and inventory/version gaps.

## Procedure
1. Enumerate endpoints and actors.
2. Map sensitive data and privileged operations.
3. Test authentication and token validation.
4. Test function- and object-level authorization.
5. Probe validation and injection boundaries.
6. Review outbound request controls.
7. Check resource limits and abuse resistance.
8. Inspect error/log data leakage.
9. Review dependency and configuration exposure.
10. Rank findings by exploitability and impact.
11. Verify fixes with regression tests.

## Decision points
Fix architectural authorization gaps before cosmetic hardening. Use compensating controls only with explicit residual-risk acceptance.

## Common failure patterns
Testing only happy paths, trusting hidden IDs, permissive CORS, secrets in logs, and security checks implemented only at gateways.

## Verification
Negative security tests and targeted scans confirm controls at the actual resource boundary.

## Expected output
Prioritized findings with verified remediation evidence.

## Stop conditions
Escalate immediately for exploitable critical exposure or when testing requires unauthorized production impact.
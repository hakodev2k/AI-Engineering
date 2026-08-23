# Security Quality Validation

## Purpose
Integrate practical security verification into quality work while respecting the boundary between quality engineering and specialist security assessment.

## When to use
Use for authentication, authorization, sensitive data, input handling, dependency changes, and externally exposed features.

## Inputs
Threat model, requirements, roles, API/UI behavior, security controls, scan results.

## Context to inspect
Inspect trust boundaries, privilege rules, validation, secrets handling, error disclosure, session behavior, dependencies, and auditability.

## Core knowledge
Security tests should verify explicit controls and abuse cases. Passing scanners does not prove security. Authorization requires negative tests across identities and resources.

## Procedure
1. Identify security-sensitive behavior from requirements and threat model.
2. Verify authentication/session boundaries.
3. Build positive and negative authorization cases.
4. Test input boundaries and error disclosure.
5. Verify sensitive-data handling and logging expectations.
6. Review dependency/security scan findings by exploitability.
7. Exercise abuse cases safe for the environment.
8. Record evidence and residual risk.
9. Escalate specialist findings appropriately.

## Decision points
Automate stable security regressions; use specialist penetration testing for complex adversarial assurance.

## Common failure patterns
Only testing happy-path login, relying solely on scanners, testing authorization only by role name, and exposing secrets in test artifacts.

## Verification
Confirm critical controls have negative evidence and specialist-required risks are explicitly handed off.

## Expected output
Security-focused regression evidence and documented unresolved risks.

## Stop conditions
Do not perform destructive exploitation, credential attacks, or unauthorized production testing; escalate to security owners.
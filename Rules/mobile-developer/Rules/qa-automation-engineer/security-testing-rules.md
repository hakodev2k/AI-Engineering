# Security Testing Rules

## Purpose
Integrate repeatable security checks without overstating assurance or exposing sensitive assets.

## Scope
Applies to authentication, authorization, input handling, dependency/security scans, session behavior, and automated abuse cases.

## MUST
- Security-relevant automation MUST test both allowed and denied behavior for critical authorization boundaries.
- Authentication/session tests MUST avoid exposing reusable credentials or tokens in artifacts.
- Scanner findings MUST be triaged by evidence, reachability, severity, and project policy.
- Tests that modify permissions, identities, or security configuration MUST restore owned state.

## MUST NOT
- MUST NOT treat a clean automated scan as proof that the system is secure.
- MUST NOT weaken security controls to make automation easier.
- MUST NOT run destructive security tests against production without explicit human authorization.

## SHOULD
- Include regression tests for previously confirmed security defects when safe and stable.
- Prefer least-privilege test identities.

## Exceptions
High-risk security validation requiring specialized tooling or access must be escalated to authorized security personnel.

## Verification
Review authorization matrices, denied cases, secret scanning, scanner reports, credential scope, and approved security-test plans.
# Skill: Secure Code Review

## Purpose
Find implementation-level vulnerabilities and unsafe security assumptions in code changes.

## Inputs
Patch, affected flows, threat model, framework/runtime, tests, configuration, dependency changes.

## Procedure
1. Trace untrusted input to security-sensitive sinks.
2. Inspect authn/authz enforcement at resource and action boundaries.
3. Inspect injection, deserialization, path/file, SSRF, redirect, template, command, and query construction risks where applicable.
4. Inspect secrets, crypto usage, randomness, token validation, expiry, replay, and key handling.
5. Inspect concurrency/idempotency where it can bypass authorization or integrity.
6. Inspect logging for sensitive data and missing audit events.
7. Inspect dependency and build-script changes.
8. Review negative-path tests and abuse-case tests.
9. Produce actionable findings with exact location, attack preconditions, impact, and remediation.
10. Verify fixes independently for high risk.

## Constraints
Do not provide unsupported exploit claims. Do not demand style-only changes as security blockers.

## Output
Blocking/major/minor findings, evidence, remediation, test expectations, residual risk.

## Stop
No unresolved blocking finding, or authorized escalation exists.
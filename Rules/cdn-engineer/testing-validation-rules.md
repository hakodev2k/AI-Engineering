# Testing and Validation Rules

## Purpose
Detect CDN correctness, compatibility, security, and resilience regressions before broad production impact.

## Scope
Applies to configuration tests, edge code tests, cache behavior, routing, TLS, security, performance, and failure scenarios.

## MUST
- Critical behaviors MUST have repeatable tests for hit, miss, expiry, error, and relevant request variants.
- Tests MUST cover authenticated/private paths when the CDN handles them.
- Configuration changes MUST be validated against representative hostnames, paths, regions, and protocols.
- Failure tests MUST verify origin timeout, failover, stale serving, and degraded behavior where applicable.
- Production verification MUST confirm effective edge behavior after propagation.

## MUST NOT
- MUST NOT rely solely on configuration syntax validation.
- MUST NOT use retries to hide deterministic failures.
- MUST NOT test destructive or high-volume scenarios against production without explicit approval and safeguards.

## SHOULD
- Maintain contract tests for provider-independent semantics.
- Automate regression tests in CI where APIs or test environments permit.
- Preserve representative fixtures for headers and cache variants.

## Exceptions
Tests that cannot be automated require documented manual evidence and reviewer sign-off proportional to risk.

## Verification
Review CI results, integration tests, synthetic probes, failure-injection evidence, security tests, representative POP checks, and post-deployment validation records.
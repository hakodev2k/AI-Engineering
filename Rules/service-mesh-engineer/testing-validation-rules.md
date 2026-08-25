# Testing and Validation
## Purpose
Prove mesh behavior before relying on it in production.
## Scope
Policy tests, connectivity, failure injection, upgrades, security, and regression testing.
## MUST
- Critical allow and deny paths MUST have deterministic tests.
- Routing changes MUST test intended destinations and negative match cases.
- Failure behavior MUST be tested for critical dependencies.
## MUST NOT
- MUST NOT treat configuration syntax validation as behavioral validation.
- MUST NOT rely on flaky tests as release evidence.
- MUST NOT skip negative security tests for privileged paths.
## SHOULD
- Test environments SHOULD reproduce relevant production policy hierarchy and network boundaries.
## Exceptions
Unreproducible production-only behavior requires documented manual evidence and monitoring.
## Verification
Use CI results, integration tests, fault injection, synthetic probes, and security policy tests.
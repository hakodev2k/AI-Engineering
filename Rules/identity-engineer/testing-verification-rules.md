# Testing and Verification
## Purpose
Require evidence that identity controls behave correctly under success and failure.
## Scope
Protocol, policy, lifecycle, security, resilience, and regression testing.
## MUST
- Critical authentication and authorization paths MUST have positive and negative tests.
- Tests MUST cover expired, revoked, malformed, replayed, wrong-audience, and insufficient-privilege cases where applicable.
- Lifecycle tests MUST verify effective provisioning and revocation in target systems.
- Security claims MUST be backed by tests, configuration inspection, or equivalent evidence.
## MUST NOT
- Mock-only tests MUST NOT be the sole evidence for critical external identity integration behavior.
- Flaky security tests MUST NOT be silently retried until green.
## SHOULD
- Automate protocol and policy regression suites in CI.
## Exceptions
Document untestable behavior, alternate evidence, risk, and reviewer.
## Verification
CI results, integration environments, protocol traces, access tests, and manual evidence review.
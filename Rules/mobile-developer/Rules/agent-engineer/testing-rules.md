# Agent Testing Rules
## Purpose
Detect deterministic and probabilistic failures before release.
## Scope
Unit, integration, scenario, end-to-end, failure, and concurrency tests.
## MUST
- Test tool adapters independently from model behavior.
- Cover critical paths, denied actions, timeouts, malformed outputs, retries, partial failures, and termination.
- Make deterministic components deterministic in tests.
## MUST NOT
- Hide flaky failures with unlimited retries.
- Depend exclusively on live third-party services for core CI verification.
## SHOULD
- Use controlled fixtures and recorded responses where they preserve relevant behavior.
## Exceptions
Live tests may be required for provider compatibility but must be isolated and clearly classified.
## Verification
Review CI results, flaky-test rates, scenario coverage, mocks, fixtures, and failure-injection tests.
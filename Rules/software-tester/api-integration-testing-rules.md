# API and Integration Testing Rules

## Purpose
Validate contracts and failure behavior across service boundaries.
## Scope
HTTP APIs, messaging, webhooks, files, queues, and third-party integrations.
## MUST
- Test contract shape, validation, authorization, errors, timeouts, retries, idempotency, and compatibility where applicable.
- Verify boundary behavior with realistic dependency responses including partial failure.
- Check that observable side effects occur exactly as intended.
## MUST NOT
- Treat a 2xx status alone as proof of correct integration behavior.
- Depend solely on UI tests for critical service contracts.
## SHOULD
- Use contract tests and targeted integration tests to localize boundary failures.
## Exceptions
Unavailable third parties may be simulated when simulator limitations are documented.
## Verification
Review request/response evidence, side effects, contract checks, logs, and failure-path results.
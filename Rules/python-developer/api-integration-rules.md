# API and Integration Rules
## Purpose
Keep external interactions bounded, compatible, and failure-aware.
## Scope
HTTP APIs, SDKs, webhooks, RPC, and third-party services.
## MUST
- External calls MUST define timeout and error handling.
- Retries MUST be bounded and limited to operations safe to retry.
- Public contract changes MUST be assessed for compatibility before release.
- Idempotency MUST be addressed for duplicate-prone write operations.
## MUST NOT
- MUST NOT retry permanent failures blindly.
- MUST NOT assume remote responses satisfy local invariants without validation.
## SHOULD
- Use contract tests for critical integrations.
## Exceptions
Provider-specific behavior requires documented evidence.
## Verification
Contract/integration tests, timeout tests, retry tests, and API diff review.
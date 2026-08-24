# API and Integration Rules
## Purpose
Keep developer-platform integrations stable, secure, and resilient.
## Scope
Internal APIs, webhooks, SCM integrations, CI providers, identity systems, package services, and external developer tools.
## MUST
- Integrations MUST define authentication, authorization, timeout, retry, idempotency, error, and compatibility behavior where applicable.
- External input MUST be validated before privileged or state-changing actions.
- Webhook authenticity and replay risk MUST be addressed for security-sensitive events.
- Dependency outages MUST have bounded failure behavior.
## MUST NOT
- MUST NOT use unbounded retries or infinite waits.
- MUST NOT trust caller-supplied identity or authorization claims without verification.
- MUST NOT expose provider credentials in client-visible configuration or logs.
## SHOULD
- Integration adapters SHOULD isolate provider-specific semantics from core workflow logic.
- Backoff with jitter SHOULD be used for safe transient retries.
## Exceptions
Provider limitations require documented constraints, compensating controls, risk, and owner.
## Verification
Use contract/integration tests, authentication and replay tests, timeout/failure injection, secret scans, compatibility checks, and provider telemetry.
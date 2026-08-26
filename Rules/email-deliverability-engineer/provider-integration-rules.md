# Provider Integration Rules

## Purpose
Keep email-service-provider integrations reliable, portable, secure, and diagnosable.

## Scope
Provider APIs, SMTP credentials, webhooks, event schemas, failover, quotas, and migrations.

## MUST
- Provider credentials MUST use least privilege, approved secret storage, and controlled rotation.
- API and webhook integrations MUST validate authentication, event identity, retry semantics, and idempotency.
- Provider event schemas MUST be version-aware and unknown events MUST not be silently discarded.
- Provider-specific identifiers MUST be correlated with internal message and stream identifiers for diagnosis.
- Migrations MUST preserve suppression, authentication, reputation strategy, and event processing.

## MUST NOT
- MUST NOT expose provider credentials in code, logs, templates, or client applications.
- MUST NOT assume provider acceptance equals mailbox delivery.
- MUST NOT enable automatic failover that bypasses consent, suppression, or reputation safeguards.

## SHOULD
- Abstract only the provider differences that have demonstrated operational value.
- Periodically test webhook replay and provider outage behavior.

## Exceptions
Emergency provider switching requires incident scope, data and reputation risk, monitoring, rollback, and human approval.

## Verification
Review credentials and permissions, webhook signatures, event replay tests, idempotency tests, provider quotas, suppression reconciliation, and migration runbooks.
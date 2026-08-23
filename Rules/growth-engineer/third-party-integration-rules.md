# Third-Party Integration Rules

## Purpose
Control reliability, security, privacy, and measurement risk introduced by growth vendors.

## Scope
Analytics, messaging, attribution, experimentation, CRM, advertising, and personalization integrations.

## MUST
- Document data shared, permissions, failure behavior, rate limits, ownership, and exit strategy for material integrations.
- Use least-privilege credentials stored in approved secret management.
- Define timeouts, retries, idempotency, and degradation behavior where integrations affect customer flows.

## MUST NOT
- Send data to a vendor merely because the SDK supports it.
- Allow an optional vendor outage to block a critical customer action without an approved dependency decision.

## SHOULD
- Isolate vendor-specific behavior behind replaceable boundaries for critical capabilities.

## Exceptions
Prototype integrations may use simplified architecture when exposure, data sensitivity, and lifetime are bounded.

## Verification
Inspect permissions, payloads, contracts, secret storage, failure tests, vendor settings, data retention, and fallback behavior.
# API Security Architecture Rules

## Purpose
Protect public and internal APIs through explicit contract, identity, authorization, abuse, and failure controls.

## Scope
HTTP APIs, RPC endpoints, webhooks, machine-to-machine interfaces, and externally consumed service contracts.

## MUST
- APIs MUST define authentication, authorization, input constraints, error behavior, rate limits, and sensitive-data handling.
- Object- and action-level authorization MUST be enforced server-side for every protected resource.
- Replay-sensitive operations MUST use appropriate nonce, timestamp, idempotency, or equivalent controls.
- Public API changes that weaken security or expose new sensitive data MUST undergo security review.
- Webhook receivers MUST validate sender authenticity and replay resistance where applicable.

## MUST NOT
- MUST NOT expose secrets, stack traces, internal identifiers, or unnecessary sensitive fields in API responses.
- MUST NOT use obscurity of endpoint paths as an access control.
- MUST NOT trust caller-supplied tenant, role, or privilege claims without verification.

## SHOULD
- Prefer schema validation, consistent error models, and centralized authentication middleware.

## Exceptions
Require documented need, abuse analysis, compensating controls, monitoring, and approval.

## Verification
Inspect API specifications, gateway policy, authorization tests, negative tests, rate-limit configuration, logs, and security test results.
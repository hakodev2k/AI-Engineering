# API and Integration Rules
## Purpose
Protect contracts and predictable cross-system behavior.
## Scope
HTTP APIs, messaging, events, webhooks, and third-party integrations.
## MUST
- Public or shared contracts MUST define validation, error semantics, compatibility expectations, and ownership.
- Breaking changes MUST use an approved migration or versioning strategy.
- Side-effecting retryable operations MUST address idempotency.
## MUST NOT
- Leak internal implementation details as accidental external contracts.
- Depend indefinitely on undocumented third-party behavior without mitigation.
## SHOULD
- Use contract tests for high-value integrations and document timeout/retry expectations.
## Exceptions
Intentional breaking changes require consumer impact analysis, communication, approval, and rollout plan.
## Verification
Inspect schemas, API tests, contract tests, versioning, integration configuration, and consumer migration evidence.
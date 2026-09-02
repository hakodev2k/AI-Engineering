# Integration, API, and Messaging Rules

## Purpose
Establish cloud integration boundaries that remain compatible, observable, secure, and resilient as independently owned systems evolve.

## Scope
Applies to synchronous APIs, asynchronous messaging, webhooks, external integrations, gateways, and cross-domain contracts.

## MUST
- Integration contracts MUST define ownership, authentication, authorization, schema, errors, timeouts, versioning or compatibility expectations, and operational support boundaries.
- Synchronous calls MUST define finite timeouts and retry behavior appropriate to idempotency and downstream capacity.
- State-changing operations exposed to retryable clients SHOULD support idempotency; where they do not, duplicate-processing risk MUST be documented and controlled.
- Breaking contract changes MUST require consumer impact analysis, migration strategy, communication, and accountable approval before production execution.
- External integrations MUST define outage, throttling, credential rotation, and degraded-mode behavior.

## MUST NOT
- MUST NOT retry non-idempotent operations blindly.
- MUST NOT expose internal implementation details as permanent public contracts without intentional review.
- MUST NOT allow integration failures to disappear without observable error or remediation paths.

## SHOULD
- Prefer explicit domain contracts and loose coupling over shared databases.
- Use asynchronous integration when temporal decoupling materially improves resilience and requirements permit it.

## Exceptions
Exceptions require compatibility analysis, risk, affected consumers, mitigation, and approval.

## Verification
Review API specifications, schemas, contract tests, timeout and retry settings, consumer inventories, failure tests, gateway policy, and operational telemetry.
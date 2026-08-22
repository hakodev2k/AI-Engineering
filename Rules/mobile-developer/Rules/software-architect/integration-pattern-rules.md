# Integration Pattern Rules

## Purpose
Make service and system integrations reliable, understandable, and evolvable.

## Scope
Applies to synchronous calls, messaging, events, webhooks, external integrations, retries, and failure handling.

## MUST
- Integration style MUST be chosen from latency, consistency, coupling, failure, and ownership requirements.
- Remote calls MUST define timeout, retry, idempotency, and error-handling behavior where applicable.
- Event and message contracts MUST define delivery, ordering, duplication, and schema-evolution expectations.
- External dependencies MUST have explicit failure and degradation behavior.

## MUST NOT
- MUST NOT treat network calls as local calls with equivalent reliability.
- MUST NOT retry non-idempotent operations blindly.
- MUST NOT introduce asynchronous messaging solely to appear decoupled when operational complexity outweighs value.

## SHOULD
- Prefer loose coupling where business consistency allows it.
- Prefer bounded retries with jitter and explicit dead-letter or recovery handling.

## Exceptions
Simpler integration behavior is acceptable when failure impact is low and evidence supports the reduced controls.

## Verification
Review sequence diagrams, integration tests, failure tests, timeout/retry configuration, message schemas, and production telemetry.
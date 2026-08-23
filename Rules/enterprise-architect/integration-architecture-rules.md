# Integration Architecture Rules

## Purpose
Ensure enterprise integrations are explicit, resilient, governable, and evolution-friendly.

## Scope
APIs, events, messaging, batch exchange, file transfer, partner integration, and shared integration platforms.

## MUST
- Integration contracts MUST define ownership, semantics, compatibility, failure behavior, security, and service expectations.
- Cross-domain integrations MUST minimize hidden temporal and data-model coupling.
- Critical integrations MUST define timeout, retry, idempotency, observability, and recovery expectations where applicable.

## MUST NOT
- MUST NOT use shared databases as an undocumented integration contract.
- MUST NOT introduce enterprise-wide synchronous dependencies without evaluating failure propagation.

## SHOULD
- Prefer explicit versioned contracts and asynchronous patterns where business semantics tolerate eventual consistency.

## Exceptions
Direct coupling requires documented rationale, bounded blast radius, and migration strategy.

## Verification
Review interface catalogs, contracts, dependency maps, resilience tests, and operational telemetry.
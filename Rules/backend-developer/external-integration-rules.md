# External Integration Rules

## Purpose
Keep third-party and cross-service dependencies from destabilizing backend correctness and availability.

## Scope
HTTP APIs, SDKs, webhooks, partner services, and infrastructure dependencies outside the service boundary.

## MUST
- External dependencies MUST have explicit timeout, error, and availability assumptions.
- Input from external systems MUST be treated as untrusted and validated.
- Dependency failures MUST be isolated from unrelated service functionality where practical.
- Integration contracts MUST be version-aware and monitored for breaking changes.

## MUST NOT
- MUST NOT assume external success based only on transport-level success.
- MUST NOT retry non-idempotent calls blindly.
- MUST NOT let one dependency consume unbounded threads, connections, or queue capacity.

## SHOULD
- Integrations SHOULD use adapters that isolate provider-specific behavior.
- Critical dependencies SHOULD have synthetic or contract monitoring.

## Exceptions
Tightly coupled integrations require documented rationale, failure-mode analysis, and recovery procedures.

## Verification
Review dependency configuration, contract tests, timeout settings, failure injection, telemetry, and provider change handling.
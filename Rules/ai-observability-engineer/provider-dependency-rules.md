# Provider and Dependency Observability Rules

## Purpose
Ensure external model providers, vector stores, search services, tools, and other dependencies can be isolated as sources of AI production impact.

## Scope
Applies to third-party APIs, managed inference, databases, retrieval systems, queues, and internal downstream services.

## MUST
- Critical dependencies MUST expose request rate, error rate, latency, timeout, and saturation or quota signals where available.
- Dependency telemetry MUST identify provider/service and operation without embedding sensitive credentials or uncontrolled identifiers.
- Provider-specific status codes MUST be mapped to stable internal categories while preserving useful diagnostic detail.
- Quota exhaustion, throttling, regional impairment, and failover activation MUST be separately observable.
- Dependency incidents MUST be correlated with user-facing impact rather than reported solely from component health.

## MUST NOT
- A provider status page MUST NOT substitute for application-side measurement.
- Failover success MUST NOT hide increased latency, cost, or quality degradation.
- External failures MUST NOT be automatically blamed without trace or metric evidence.

## SHOULD
- Maintain provider-specific baselines for latency and error behavior.
- Record region or endpoint class where it materially affects reliability and cardinality remains bounded.

## Exceptions
Limited black-box dependencies may use synthetic probes and application-side evidence when internal metrics are unavailable.

## Verification
Force or simulate dependency failures, throttling, timeout, and failover; confirm dashboards and traces attribute impact correctly.
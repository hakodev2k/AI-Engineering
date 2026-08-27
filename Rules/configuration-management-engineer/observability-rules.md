# Configuration Observability

## Purpose
Make configuration state, propagation, failures, and behavioral effects visible in production.

## Scope
Configuration services, clients, rollout systems, reconciliation agents, and operational telemetry.

## MUST
- Critical consumers MUST expose enough metadata to identify the active configuration revision without exposing sensitive values.
- Rollout systems MUST surface propagation failures and stale consumers.
- Configuration load and validation failures MUST be observable and actionable.
- Metrics and logs MUST distinguish desired revision from active revision when propagation is asynchronous.
- Incident investigation MUST be able to correlate behavior changes with configuration changes.

## MUST NOT
- Observability MUST NOT log secrets, tokens, private keys, or sensitive payloads.
- A control-plane success response MUST NOT be the only evidence that all consumers activated the change.
- High-cardinality raw configuration values MUST NOT be emitted indiscriminately into telemetry.

## SHOULD
- Track propagation latency, failure rate, stale-client count, and rollback events for critical systems.
- Provide dashboards keyed by revision and affected scope.

## Exceptions
Constrained devices may expose reduced telemetry, but must provide a safe method to determine active revision and failure state.

## Verification
Inspect logs, metrics, traces, dashboards, and alerts. Perform a controlled rollout and verify revision propagation, failures, stale consumers, and rollback are visible without leaking sensitive values.
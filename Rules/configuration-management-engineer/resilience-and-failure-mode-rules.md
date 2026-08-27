# Resilience and Failure Modes

## Purpose
Ensure configuration infrastructure failures do not create uncontrolled service failure or unsafe state.

## Scope
Configuration stores, distribution services, caches, clients, bootstrap paths, and control planes.

## MUST
- Critical consumers MUST define behavior for configuration-source unavailability.
- Last-known-good state MUST be used only when its safety and staleness limits are understood.
- Corrupt or unverifiable configuration MUST fail according to an explicit safety policy.
- Control-plane outages MUST have documented operational recovery procedures.
- Configuration delivery architecture MUST identify single points of failure and blast radius.

## MUST NOT
- Consumers MUST NOT silently switch to permissive security defaults when configuration cannot be loaded.
- Cached configuration MUST NOT be trusted indefinitely without a defined validity policy when freshness matters.
- Recovery automation MUST NOT amplify an outage through uncontrolled retry storms.

## SHOULD
- Use bounded retries with backoff and jitter.
- Test loss of configuration dependencies and stale-state behavior.

## Exceptions
Fail-open behavior is acceptable only when explicitly required by business continuity and supported by documented security and safety analysis.

## Verification
Run failure-injection tests for unavailable, delayed, stale, corrupt, and partially propagated configuration. Inspect retry behavior, fallback state, alerts, and recovery procedures.
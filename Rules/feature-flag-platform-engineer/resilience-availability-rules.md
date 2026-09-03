# Resilience and Availability Rules

## Purpose
Keep flag-dependent applications predictable during provider, network, or regional failures.

## Scope
Applies to control plane availability, data plane evaluation, streaming, polling, caches, and regional dependencies.

## MUST
- The architecture MUST distinguish control-plane failure from data-plane evaluation failure.
- Critical applications MUST define behavior for provider outage, network partition, stale cache, and regional degradation.
- Availability assumptions MUST be backed by tested fallback behavior.
- Retry policies MUST use bounded attempts, backoff, and jitter where repeated remote calls are necessary.
- Critical local caches or bootstrap state MUST be protected against malformed configuration.

## MUST NOT
- MUST NOT create retry storms during provider degradation.
- MUST NOT assume control-plane unavailability implies existing local evaluations cannot continue.
- MUST NOT discard the last known good configuration solely because refresh failed.

## SHOULD
- Multi-region systems SHOULD evaluate whether flag delivery introduces hidden cross-region dependencies.

## Exceptions
Systems requiring strongly fresh centralized decisions need explicit availability trade-offs and recovery plans.

## Verification
Run fault-injection tests, outage simulations, cache corruption tests, retry analysis, and regional dependency review.
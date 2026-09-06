# Circuit Breaker Rules

## Purpose
Prevent unhealthy providers or models from consuming capacity and amplifying failures.

## Scope
Health states, failure thresholds, open/half-open behavior, probing, and recovery.

## MUST
- Circuit breakers MUST use defined signals relevant to provider health, not arbitrary error counts alone.
- Breaker scope MUST match the failure domain, such as provider, endpoint, region, model, or credential pool.
- Open-state routing MUST use approved fallback or fail behavior.
- Half-open probes MUST be bounded so recovery testing cannot recreate an outage.
- Breaker transitions MUST be observable with cause and duration.

## MUST NOT
- MUST NOT open breakers for caller-caused validation or policy failures.
- MUST NOT automatically restore full traffic based on a single successful probe.
- MUST NOT use a global breaker when only a narrow failure domain is unhealthy unless justified.

## SHOULD
- Combine error rate with latency and saturation when those signals improve diagnosis.
- Use hysteresis to avoid rapid route oscillation.

## Exceptions
Exceptions require documented failure-domain reasoning and verification evidence.

## Verification
Inspect breaker configuration, fault-injection tests, transition telemetry, and recovery behavior.
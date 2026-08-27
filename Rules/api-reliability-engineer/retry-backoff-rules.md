# Retry and Backoff Rules

## Purpose
Recover from transient failures without amplifying overload or duplicating side effects.

## Scope
Applies to API clients, gateways, workers, SDKs, and service-to-service integrations.

## MUST
- Retries MUST be limited to failures classified as plausibly transient.
- Retry attempts MUST be bounded by count and caller deadline.
- Backoff MUST include jitter for distributed callers where synchronized retries can create load spikes.
- Non-idempotent operations MUST have duplicate-effect protection before automatic retry.
- Retry telemetry MUST expose attempts, terminal outcomes, and added latency.

## MUST NOT
- MUST NOT retry authentication, authorization, validation, or other permanent failures by default.
- MUST NOT create multiplicative retry storms across multiple service layers.
- MUST NOT conceal dependency failure by reporting only eventual success without retry metrics.

## SHOULD
- Retries SHOULD occur at the layer with the best knowledge of idempotency and remaining deadline.
- Servers SHOULD communicate retry guidance when protocol semantics permit.

## Exceptions
Exceptions require failure evidence, load analysis, bounded attempt policy, duplicate-risk analysis, and review.

## Verification
Inspect retry configuration and code, integration tests, traces, load tests, fault injection, and metrics for retry amplification and duplicate effects.
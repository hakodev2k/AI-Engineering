# Circuit Breaker Rules

## Purpose
Fail predictably when a dependency is unhealthy and avoid repeatedly spending resources on calls unlikely to succeed.

## Scope
Applies where circuit breakers are used around remote or resource-intensive dependencies.

## MUST
- Breaker thresholds MUST be tied to meaningful failure signals and sufficient sample volume.
- Open, half-open, and recovery behavior MUST be bounded and observable.
- Breaker scope MUST align with failure isolation; one tenant, host, or operation MUST NOT unnecessarily trip unrelated healthy traffic.
- Recovery probes MUST be rate-limited and safe.
- Breaker behavior MUST preserve request deadlines and documented error semantics.

## MUST NOT
- MUST NOT use circuit breakers as a substitute for correct timeouts.
- MUST NOT count caller-caused permanent errors as dependency-health failures unless justified.
- MUST NOT create a hidden global single point of failure through centralized breaker state.

## SHOULD
- Thresholds SHOULD be validated using historical incidents or fault injection.
- Breaker state SHOULD be visible in operational dashboards.

## Exceptions
Exceptions require evidence that another control provides equivalent bounded failure behavior and explicit review.

## Verification
Inspect configuration, unit/integration tests, fault injection, traces, state-transition metrics, and recovery behavior under partial dependency failure.
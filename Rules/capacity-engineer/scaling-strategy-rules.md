# Scaling Strategy

## Purpose
Ensure scaling mechanisms match workload behavior, operational constraints, and failure modes.

## Scope
Applies to vertical scaling, horizontal scaling, autoscaling, partition expansion, and manual capacity additions.

## MUST
- Scaling strategies MUST define trigger metrics, decision thresholds, scaling latency, minimum and maximum capacity, and failure behavior.
- Autoscaling MUST account for startup time, warm-up effects, downstream limits, and feedback loops.
- Scaling changes MUST be tested against realistic load before relying on them for critical demand.
- Manual scaling dependencies MUST have documented lead times and accountable owners.

## MUST NOT
- MUST NOT scale one tier in a way that predictably overloads a constrained downstream tier.
- MUST NOT use CPU utilization as the sole scaling signal when another resource is the actual bottleneck.
- MUST NOT assume autoscaling removes the need for baseline capacity planning.

## SHOULD
- Prefer signals directly correlated with saturation or queueing risk.
- Scaling policies SHOULD include cooldown or stabilization behavior appropriate to workload volatility.

## Exceptions
Exceptions require evidence, risk analysis, compensating controls, and approval for production-critical systems.

## Verification
Inspect autoscaling configuration, load tests, scale-event telemetry, dependency limits, startup latency, and incident history.

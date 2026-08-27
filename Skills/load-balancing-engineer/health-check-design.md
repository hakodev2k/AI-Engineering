# Health Check Design

## Purpose
Design health signals that remove failed or unsafe backends quickly without ejecting healthy capacity during transient degradation.

## When to use
Use for new pools, recurring false-positive ejections, slow failure detection, or readiness changes.

## Inputs
Failure modes, dependency graph, SLOs, probe endpoints, intervals, thresholds, startup time, and recovery behavior.

## Context to inspect
Inspect existing probes, application readiness semantics, dependency health, load-balancer timers, deployment behavior, and incident history.

## Core knowledge
Liveness and readiness answer different questions. A useful balancing probe tests whether a backend can safely receive relevant traffic. Probe frequency, timeout, healthy/unhealthy thresholds, and distributed probe sources jointly determine detection and recovery time.

## Procedure
1. Enumerate failures that require traffic removal.
2. Separate process liveness from traffic readiness.
3. Choose a cheap representative probe.
4. Set timeout below the probe interval and service latency budget.
5. Tune failure and recovery thresholds against desired detection time.
6. Avoid making every downstream dependency a hard health prerequisite.
7. Add startup grace or slow start where needed.
8. Test partial failures, overload, and dependency degradation.
9. Observe probe traffic and ejection rates.
10. Document expected state transitions.

## Decision points
Use shallow probes when dependencies can degrade gracefully; use deeper checks only when accepting traffic would certainly fail. Favor asymmetric thresholds when fast failure detection but cautious recovery is needed.

## Common failure patterns
Probe endpoint always returns success; probes are more expensive than normal traffic; cascading ejection due to shared dependency failure; flapping thresholds; recovery immediately receives full load.

## Verification
Inject backend and dependency failures, measure detection/recovery times, and confirm healthy capacity is retained.

## Expected output
Validated probe semantics, thresholds, timers, and failure-state behavior.

## Stop conditions
Escalate when application readiness semantics cannot be defined or probe behavior risks cascading capacity loss.
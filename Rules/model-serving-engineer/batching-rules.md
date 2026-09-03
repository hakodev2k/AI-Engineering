# Batching Rules

## Purpose
Use batching to improve accelerator efficiency without violating latency or fairness requirements.

## Scope
Applies to static, dynamic, continuous, and token-level batching.

## MUST
- Define maximum batch size and maximum queue delay from measured workload behavior.
- Validate batching policies against tail latency, throughput, memory use, and fairness.
- Bound per-request waiting time before execution.
- Re-test batching after material model, sequence-length, hardware, or runtime changes.

## MUST NOT
- Maximize batch size solely from average throughput results.
- Allow one request class to starve another without an explicit scheduling policy.
- Enable production batching settings that have not been load tested.

## SHOULD
- Group compatible workloads when it improves utilization without violating SLOs.
- Track batch occupancy and queue delay as first-class metrics.

## Exceptions
Exceptions require measured evidence, expected SLO impact, rollback settings, and approval for production changes.

## Verification
Review benchmark results, batch metrics, queue-delay distributions, load tests, and runtime configuration.
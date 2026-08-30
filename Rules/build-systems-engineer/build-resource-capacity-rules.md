# Build Resource and Capacity Rules

## Purpose
Ensure build infrastructure has sufficient CPU, memory, storage, network, and concurrency capacity without creating unstable contention.

## Scope
Applies to CI workers, remote execution pools, local parallelism defaults, cache storage, artifact transfer, and scheduler limits.

## MUST
- Resource limits MUST reflect measured action requirements and worker capabilities.
- Memory- or CPU-intensive actions MUST declare resource needs where the scheduler supports them.
- Capacity planning MUST consider peak concurrency, queue latency, failure-domain loss, and expected growth.
- Concurrency changes MUST be validated against throughput, latency, memory pressure, and downstream service limits.
- Persistent capacity saturation MUST trigger either demand reduction, optimization, or capacity expansion planning.

## MUST NOT
- MUST NOT increase parallelism blindly when bottlenecks are memory, I/O, network, or external-service limits.
- MUST NOT schedule workloads onto worker classes known to be insufficient for their declared requirements.
- MUST NOT interpret average utilization alone as proof that peak capacity is adequate.

## SHOULD
- Capacity decisions SHOULD use percentile queue and execution metrics rather than averages alone.
- Worker pools SHOULD reserve appropriate headroom for failures and demand spikes.

## Exceptions
Temporary overcommit MUST document expected duration, monitored limits, failure symptoms, and rollback threshold.

## Verification
Review worker metrics, scheduler configuration, queue distributions, resource exhaustion events, concurrency experiments, storage growth, and capacity forecasts.
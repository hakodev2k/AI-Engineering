# Backpressure and Flow Control

## Purpose
Keep streaming pipelines stable when producers, brokers, processors, or sinks run at different rates.

## When to use
Use for rising lag, queue growth, sink saturation, memory pressure, or capacity design.

## Inputs
Arrival/service rates, lag metrics, batch sizes, concurrency, sink quotas, buffer limits.

## Context to inspect
Consumer fetch settings, internal queues, async calls, broker quotas, autoscaling, retry behavior.

## Core knowledge
Unbounded buffering converts throughput mismatch into memory or latency failure. Backpressure must propagate safely and overload behavior must be explicit.

## Procedure
1. Locate the constrained stage using rates and latency.
2. Quantify sustainable service capacity.
3. Bound buffers and concurrency.
4. Tune batching/fetching from measurements.
5. Propagate pressure upstream where supported.
6. Apply admission control or shedding only with business approval.
7. Prevent retries from amplifying load.
8. Load-test sustained and burst traffic.

## Decision points
Scale out for parallelizable bottlenecks; optimize or isolate serial sinks; buffer bursts only when backlog can drain within SLO.

## Common failure patterns
Unlimited queues; autoscaling on CPU while lag grows; retry storms; excessive concurrency against constrained databases.

## Verification
Stress tests show bounded memory, predictable lag, recovery after bursts, and no downstream overload.

## Expected output
Capacity model, flow-control settings, and overload policy.

## Stop conditions
Escalate when required ingress exceeds provable downstream capacity and loss/throttling policy is undefined.
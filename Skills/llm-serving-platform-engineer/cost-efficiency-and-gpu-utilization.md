# Cost Efficiency and GPU Utilization

## Purpose
Reduce serving cost per useful token while preserving quality, latency, reliability, and capacity headroom.

## When to use
Use for cost reviews, hardware/runtime selection, scaling changes, or low accelerator utilization.

## Inputs
Cloud/hardware costs, utilization, tokens served, latency SLOs, model mix, power data where available, workload traces.

## Context to inspect
Replica sizing, batching, KV use, quantization, model parallelism, idle capacity, autoscaling, routing, and reserved/spot capacity policy.

## Core knowledge
High GPU utilization is not the objective if queueing violates SLOs. Unit economics should include accelerator, CPU, memory, storage, network, idle reserve, and failed/rejected work. Cost/token must be segmented by workload class and model.

## Procedure
1. Establish cost per input/output token and request. 2. Attribute infrastructure costs by model/pool. 3. Identify idle, memory-bound, compute-bound, and communication-bound waste. 4. Benchmark batching, quantization, parallelism, and hardware alternatives. 5. Tune autoscaling/minimum capacity. 6. Consolidate compatible low-volume models where safe. 7. Evaluate reserved versus interruptible capacity for workload tolerance. 8. Track cost alongside SLOs. 9. Roll out changes with canaries. 10. Recalculate after demand/model shifts.

## Decision points
Accept lower utilization when it buys required burst/reliability headroom. Use cheaper interruptible capacity only for workloads with safe rescheduling/failover.

## Common failure patterns
Optimizing utilization alone, ignoring failed tokens, comparing hardware without equal SLOs, excessive standby capacity, and cost allocation based only on request count.

## Verification
Show measured unit-cost improvement with unchanged or improved quality and SLO compliance under representative load.

## Expected output
A cost model, prioritized efficiency actions, benchmark evidence, and guardrails.

## Stop conditions
Stop if cost attribution is unreliable, quality/SLO baselines are missing, or proposed savings require unacceptable reliability risk.
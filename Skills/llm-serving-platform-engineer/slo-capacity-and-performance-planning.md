# SLO, Capacity, and Performance Planning

## Purpose
Translate product latency/availability expectations and demand forecasts into measurable serving SLOs and accelerator capacity requirements.

## When to use
Use for launch planning, growth forecasts, new models, regional expansion, or capacity procurement.

## Inputs
Traffic forecast, prompt/output distributions, SLO targets, redundancy policy, benchmark curves, growth and seasonality assumptions.

## Context to inspect
Current demand, saturation points, queueing, hardware inventory, autoscaling lag, model startup time, failure domains, and utilization.

## Core knowledge
Capacity must be derived from production-shaped service curves, not theoretical FLOPS. Plan separately for steady state, bursts, failover, deployments, and growth. Tail latency degrades before hard resource exhaustion.

## Procedure
1. Define service indicators and SLOs for TTFT, TPOT/end-to-end latency, availability, and rejection. 2. Segment workloads by model and cost profile. 3. Forecast arrival rate and token demand with uncertainty. 4. Benchmark per-serving-unit capacity at SLO boundary. 5. Calculate steady-state replicas. 6. Add burst, failover, rollout, and growth headroom explicitly. 7. Account for provisioning/warmup delay. 8. Validate with load tests. 9. Set capacity alerts and procurement lead-time triggers. 10. Review forecasts against actuals regularly.

## Decision points
Reserve dedicated capacity for strict/high-value SLOs when shared pools cannot guarantee them. Scale vertically only when it improves the service curve or model fit; otherwise scale replicas.

## Common failure patterns
Using average tokens, assuming linear scaling, no failure headroom, ignoring cold starts, capacity based on GPU utilization targets, and forecasts without confidence ranges.

## Verification
Run load at planned peak plus documented failure scenario and prove SLO compliance with expected headroom.

## Expected output
An SLO definition, workload forecast, capacity model, headroom policy, and scaling/procurement triggers.

## Stop conditions
Stop if SLOs or demand assumptions lack owners, benchmarks are not representative, or hardware lead times make the plan infeasible.
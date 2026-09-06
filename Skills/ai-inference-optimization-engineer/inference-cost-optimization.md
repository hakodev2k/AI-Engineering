# Inference Cost Optimization

## Purpose
Reduce the cost of serving AI workloads while preserving required quality, latency, reliability, and safety.

## When to use
Use when inference spend is material, unit economics are unclear, or capacity is overprovisioned.

## Inputs
Infrastructure cost, model/runtime configuration, request and token volumes, SLOs, quality thresholds, utilization, and workload segmentation.

## Context to inspect
Inspect cost by model and tenant, accelerator idle time, batch efficiency, token lengths, retries, cache hit rates, routing, reserved capacity, and autoscaling behavior.

## Core knowledge
The relevant metric is cost per successful useful outcome, not raw accelerator-hour price. Optimization levers include model selection, quantization, batching, caching, hardware choice, routing, capacity utilization, and output-length control. Lower cost is invalid if it shifts failures or latency to users.

## Procedure
1. Define the unit of useful work: request, generated token, task completion, or business outcome.
2. Attribute infrastructure and provider costs to workload classes.
3. Measure utilization and identify idle or underfilled capacity.
4. Rank cost drivers by expected savings and risk.
5. Test lower precision, better batching, routing, or hardware changes independently.
6. Eliminate avoidable retries and duplicate inference.
7. Evaluate caching where correctness permits reuse.
8. Tune autoscaling and reserved capacity against demand variability.
9. Recalculate unit economics after each validated change.
10. Maintain quality and SLO guardrails in cost dashboards.

## Decision points
Use cheaper models for workloads whose quality thresholds they satisfy. Reserve capacity for predictable baseload and elastic capacity for uncertain peaks. Cache only deterministic or safely reusable results.

## Common failure patterns
Optimizing provider price instead of total cost, excluding failed requests, degrading quality silently, over-reserving accelerators, and ignoring engineering complexity as an operating cost.

## Verification
Compare cost per successful unit before and after optimization while confirming quality, latency, error rate, and reliability remain within agreed bounds.

## Expected output
A prioritized cost-optimization plan and measured unit-economics report.

## Stop conditions
Stop when savings require violating quality/SLO constraints, attribution data is unreliable, or the proposed change creates unacceptable operational risk.
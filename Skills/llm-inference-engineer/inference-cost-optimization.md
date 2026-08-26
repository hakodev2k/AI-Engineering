# Inference Cost Optimization

## Purpose
Reduce cost per useful generated token while preserving product quality, latency, and reliability.

## When to use
Use for cost reviews, fleet growth, model changes, or low utilization.

## Inputs
Cloud/hardware cost, power where relevant, throughput, utilization, token distributions, SLOs, quality requirements, and traffic forecast.

## Context to inspect
Replica sizing, model precision, batching, cache, autoscaling, routing, hardware types, idle reserve, and failure capacity.

## Core knowledge
Cost must be normalized by useful work and service objectives. Cheaper hardware can be more expensive per compliant token if latency forces overprovisioning. Optimization spans model choice, precision, runtime, scheduling, and fleet policy.

## Procedure
1. Establish cost per input/output token by workload class and model.
2. Separate fixed idle reserve from variable serving cost.
3. Identify whether spend is driven by memory fit, compute, low utilization, or overprovisioning.
4. Benchmark alternative hardware and quantization on real workloads.
5. Tune batching and cache before adding capacity.
6. Evaluate model routing only with quality gates.
7. Improve autoscaling while preserving failure reserve.
8. Measure energy/power constraints where material.
9. Track savings against SLO and quality guardrails.

## Decision points
Use smaller/quantized models when quality remains acceptable; use premium hardware when higher density reduces total fleet cost. Do not remove resilience reserve merely to improve utilization.

## Common failure patterns
Optimizing hourly GPU price, ignoring output-length differences, counting rejected work as throughput, and sacrificing tail latency invisibly.

## Verification
Compare cost per SLO-compliant useful token before/after under representative traffic and failure reserve.

## Expected output
Ranked optimizations with measured savings, risks, and guardrails.

## Stop conditions
Stop any optimization that violates quality, security, reliability, or latency thresholds.
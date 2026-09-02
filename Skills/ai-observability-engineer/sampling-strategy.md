# Sampling Strategy

## Purpose
Design sampling that preserves diagnostically valuable AI telemetry while controlling volume, cost, and privacy exposure.

## When to use
Use for high-volume traces, sampled payload evaluation, expensive logs, or telemetry budget reductions.

## Inputs
Traffic distribution, incident frequency, trace volume, error rates, cost limits, privacy rules, and backend capabilities.

## Context to inspect
Inspect rare routes, long requests, errors, provider fallbacks, agent loops, premium workloads, and current sampling bias.

## Core knowledge
Uniform sampling can discard rare failures. Tail sampling can retain traces based on final latency/error properties but requires buffering and infrastructure. Sampling decisions must be observable and accounted for in analysis.

## Procedure
1. Define diagnostic questions and required population coverage.
2. Measure current signal volume and cost.
3. Reserve high retention for errors, severe latency, fallback, and rare critical routes.
4. Apply lower probabilistic sampling to healthy high-volume traffic.
5. Use tail sampling where complete trace outcomes justify infrastructure complexity.
6. Keep payload sampling separate and stricter than metadata sampling.
7. Record sampling probability or policy so statistical analysis can compensate.
8. Validate rare incident capture using replay or synthetic traffic.
9. Monitor collector drops independently from intentional sampling.

## Decision points
Choose head sampling for simplicity and low overhead; tail sampling for outcome-aware retention. Never infer population rates from biased samples without weighting.

## Common failure patterns
Dropping all healthy traces, retaining every error during an outage and overloading collectors, sampling payloads at trace rates, and confusing dropped telemetry with sampled telemetry.

## Verification
Run controlled cohorts with known error/latency proportions and confirm retained samples match policy and budget.

## Expected output
Sampling rules, cost model, bias documentation, and collector-health monitoring.

## Stop conditions
Stop if sampling would prevent compliance evidence or eliminate telemetry required for an active SLO.
# Scalability and Performance Rules

## Purpose
Ensure enterprise architecture can meet measurable growth and performance demands economically.

## Scope
Shared platforms, critical applications, integration paths, data workloads, and capacity strategy.

## MUST
- Material systems MUST define measurable workload, latency, throughput, concurrency, and growth assumptions where relevant.
- Scalability decisions MUST identify bottlenecks, state constraints, dependency limits, and cost implications.
- Performance claims MUST use measurements, benchmarks, capacity tests, or production evidence.

## MUST NOT
- MUST NOT claim scalability from architecture style alone.
- MUST NOT optimize enterprise platforms for hypothetical scale while ignoring current reliability or cost constraints.

## SHOULD
- Prefer designs that scale incrementally and expose capacity signals before saturation.

## Exceptions
Forecast-based assumptions are acceptable when labeled and paired with validation checkpoints.

## Verification
Inspect SLOs, load models, benchmarks, telemetry, capacity plans, and cost projections.
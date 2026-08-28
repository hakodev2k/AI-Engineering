# Telemetry Collector Pipelines

## Purpose
Build resilient collector pipelines that receive, transform, route, batch, and export telemetry without becoming a production bottleneck.

## When to use
Use when deploying OpenTelemetry Collectors, log forwarders, metric gateways, or multi-backend telemetry routing.

## Inputs
Signal volumes, collector configs, exporters, network topology, backend limits, loss tolerance.

## Context to inspect
Inspect receivers, processors, queues, retry behavior, memory limits, batching, routing, and deployment topology.

## Core knowledge
Understand pipeline stages, backpressure, bounded queues, retry semantics, memory limiting, batching, load balancing, and data loss modes.

## Procedure
1. Quantify normal and peak signal rates.
2. Separate pipelines by signal and reliability needs.
3. Configure memory limits and bounded queues.
4. Batch for backend efficiency without excessive delay.
5. Route by tenant, region, sensitivity, or backend need.
6. Configure retries only for transient failures.
7. Scale horizontally and avoid stateful assumptions.
8. Instrument collector health and dropped telemetry.
9. Failure-test exporters and network partitions.
10. Document recovery and capacity thresholds.

## Decision points
Use agents for node-local collection and gateways for shared processing or policy enforcement. Add durable queues only when loss tolerance justifies operational complexity.

## Common failure patterns
Unbounded retries, silent drops, collector OOMs, excessive transforms, and shared pipelines coupling unrelated tenants.

## Verification
Load-test peak traffic, induce backend outages, verify bounded resource use, dropped-item accounting, and recovery behavior.

## Expected output
A tested collector pipeline with explicit capacity, failure, and scaling characteristics.

## Stop conditions
Stop if loss tolerance, peak volume, or exporter failure semantics are unknown.
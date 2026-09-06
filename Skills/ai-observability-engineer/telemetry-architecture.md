# Telemetry Architecture

## Purpose
Design a telemetry architecture that captures, transports, stores, and queries AI-system evidence reliably without making the observability pipeline itself a production bottleneck.

## When to use
Use when introducing centralized telemetry, changing vendors, scaling request volume, or connecting application, model, retrieval, and infrastructure signals.

## Inputs
System topology, event volume estimates, telemetry types, retention needs, query patterns, security constraints, existing collectors, storage backends, and budget.

## Context to inspect
Inspect instrumentation libraries, collectors, exporters, queues, network boundaries, schemas, retention policies, access controls, sampling, and downstream consumers.

## Core knowledge
Telemetry is a distributed data pipeline. It needs backpressure, buffering, failure isolation, schema governance, time synchronization, correlation, and cost control. Observability loss during incidents is especially damaging.

## Procedure
1. Inventory producers and classify metrics, traces, logs, and evaluation events.
2. Estimate steady-state and burst throughput.
3. Define common identifiers and timestamps.
4. Choose collection points and batching strategy.
5. Define buffering and retry behavior that cannot overload production workloads.
6. Route sensitive and non-sensitive data appropriately.
7. Establish schema evolution rules.
8. Set sampling and retention by diagnostic value.
9. Design storage and query paths for operational and analytical use.
10. Add health telemetry for collectors and pipelines.
11. Test failure modes including backend outage, queue saturation, and malformed events.

## Decision points
Use direct export only for simple, low-volume environments. Prefer collectors when central policy, batching, routing, or protocol translation is needed. Durable buffering is justified where losing incident evidence is costly.

## Common failure patterns
Synchronous blocking exports, no pipeline health monitoring, incompatible schemas, clock skew, unbounded buffers, recursive telemetry storms, and treating the vendor backend as always available.

## Verification
Load-test the telemetry path, induce exporter/backend failures, confirm production requests remain protected, and verify end-to-end correlation and expected retention.

## Expected output
A telemetry architecture with producers, collectors, routing, schemas, storage, sampling, retention, failure handling, and operational ownership.

## Stop conditions
Escalate when regulatory restrictions, network boundaries, or capacity requirements cannot be satisfied by the proposed architecture.
# Telemetry Architecture

## Purpose
Design an end-to-end observability architecture for logs, metrics, traces, profiles, and events that is reliable, evolvable, and cost-aware.

## When to use
Use when establishing or redesigning an observability platform, onboarding major workloads, or diagnosing structural telemetry gaps. Do not use for a single dashboard tweak.

## Inputs
- Workload topology
- Reliability objectives
- Telemetry volume estimates
- Regulatory and retention requirements
- Existing collectors, backends, and agents

## Preconditions
Know the critical services, failure domains, ownership model, and production constraints.

## Context to inspect
Inspect current instrumentation, collection paths, schemas, exporters, queues, backends, retention, cardinality, and query patterns.

## Core knowledge
Understand push vs pull collection, fan-out, buffering, sampling, backpressure, multi-tenancy, schema evolution, failure isolation, and telemetry economics.

## Procedure
1. Identify observability use cases and critical user journeys.
2. Map telemetry producers and consumers.
3. Define canonical signal paths and ownership boundaries.
4. Size ingestion, storage, and query demand.
5. Design collection tiers, buffering, retry, and backpressure.
6. Define failure behavior for partial backend or network outages.
7. Establish retention, routing, and tenancy controls.
8. Define rollout and migration stages.
9. Add platform health telemetry for the observability system itself.
10. Document trade-offs and operational runbooks.

## Decision points
Centralize when consistency and shared operations dominate; federate when autonomy, locality, or regulatory boundaries require it. Prefer durable buffering where telemetry loss materially harms incident response.

## Common failure patterns
- Single collector bottlenecks
- Circular dependencies
- Unbounded cardinality
- No telemetry for the telemetry pipeline
- Treating all signals with identical retention and priority

## Verification
Load-test expected peak volume, simulate collector/backend failure, confirm recovery without unacceptable loss, and validate representative queries.

## Expected output
A documented architecture with signal flows, scaling assumptions, failure modes, tenancy, retention, and migration plan.

## Stop conditions
Stop if critical volume, compliance, ownership, or availability requirements are unknown.
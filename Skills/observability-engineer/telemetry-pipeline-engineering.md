# Telemetry Pipeline Engineering

## Purpose
Design and operate resilient collection pipelines that receive, process, route, and export telemetry without destabilizing applications.

## When to use
Use when deploying collectors, agents, gateways, processors, or multi-backend telemetry routing.

## Inputs
Telemetry volume, protocols, collectors, exporters, backend limits, topology, security requirements, and availability goals.

## Context to inspect
Inspect batching, queues, memory limits, retries, backpressure, load balancing, TLS, authentication, buffering, and failure modes.

## Core knowledge
Telemetry pipelines are production systems with capacity and reliability limits. Unbounded retries or buffers can turn a backend outage into an application or collector outage.

## Procedure
1. Estimate normal and peak signal volume.
2. Choose agent, gateway, or hybrid topology.
3. Configure batching and bounded queues.
4. Apply memory and concurrency limits.
5. Define retry and drop behavior.
6. Add filtering, transformation, and redaction.
7. Secure transport and credentials.
8. Load-test peak traffic and backend failure.
9. Monitor pipeline health independently.

## Decision points
Prefer local agents for host context and isolation; gateways centralize policy and routing. Buffer only enough to cover expected transient outages within resource budgets.

## Common failure patterns
Infinite retries, silent drops, collector single points of failure, oversized batches, missing self-monitoring, and telemetry feedback loops.

## Verification
Load-test at peak rate, intentionally fail exporters, and confirm bounded resource use, documented loss behavior, and recovery without application impact.

## Expected output
A capacity-tested, secure, observable telemetry pipeline.

## Stop conditions
Stop when peak volume, backend quotas, or data-handling requirements are unknown.
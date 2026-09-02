# AI Telemetry Pipeline Reliability

## Purpose
Ensure logs, metrics, traces, and evaluation events remain trustworthy during normal operation and incidents.

## When to use
Use when designing collectors/exporters, diagnosing missing telemetry, or hardening observability infrastructure.

## Inputs
Telemetry architecture, collector metrics, exporter queues, backend limits, sampling, retention, and failure history.

## Context to inspect
Inspect SDK buffering, collector topology, network paths, backpressure, retry queues, dropped spans/logs, clock sync, and backend ingestion limits.

## Core knowledge
Observability is a production dependency for diagnosis even when it is not on the request critical path. Telemetry systems need their own health signals. Infinite retries can worsen outages; synchronous export can harm application latency.

## Procedure
1. Map telemetry flow from application SDK to storage/query backend.
2. Instrument generated, sampled, queued, exported, rejected, and dropped records.
3. Measure exporter latency, queue saturation, and backend rejection codes.
4. Keep telemetry export off the user request critical path where possible.
5. Define bounded retry and disk/memory buffering behavior.
6. Synchronize clocks and validate timestamps.
7. Create independent alerts for significant telemetry loss.
8. Test collector/backend outage and recovery behavior.
9. Document what diagnostic evidence is unavailable during each failure mode.

## Decision points
Use local agents/collectors for buffering and normalization at scale; direct export may suffice for small systems. Prefer loss over application outage when telemetry backpressure threatens serving.

## Common failure patterns
Synchronous exporters, silent drops, unlimited buffers, recursive logging failures, no collector metrics, and assuming missing traces mean requests never occurred.

## Verification
Induce controlled exporter/backend failures and confirm application health, bounded resource use, drop visibility, and recovery.

## Expected output
Reliable telemetry architecture, self-monitoring dashboards, loss alerts, and failure-mode evidence.

## Stop conditions
Stop before destructive production fault injection without explicit approval.
# Streaming Observability

## Purpose
Detect lag, loss, duplication, reordering, stalled consumers, and processing degradation in streaming data systems.

## When to use
Use for event streams, CDC, stream processors, queues, and near-real-time data products.

## Inputs
Broker metrics, consumer offsets, event timestamps, partition metadata, watermark behavior, processing guarantees, SLOs.

## Preconditions
Understand delivery semantics, partitioning, event-time semantics, and replay strategy.

## Context to inspect
Inspect producers, brokers, partitions, consumers, checkpoints, dead-letter paths, serialization, backpressure, and downstream sinks.

## Core knowledge
Streaming correctness depends on more than throughput. Senior observability covers end-to-end latency, consumer lag, watermark progress, partition skew, duplicate handling, checkpoint health, and replay safety.

## Procedure
1. Define end-to-end latency and availability expectations.
2. Track producer rate, broker backlog, consumer lag, and processing rate.
3. Monitor partition imbalance and hot partitions.
4. Track watermark and checkpoint progression.
5. Detect duplicate and out-of-order rates where semantics matter.
6. Monitor dead-letter and poison-message volumes.
7. Correlate infrastructure saturation with processing degradation.
8. Alert on sustained consumer-impacting conditions rather than momentary spikes.
9. Test broker outage, consumer restart, poison events, and replay.
10. Validate catch-up time after recovery.

## Decision points
Use per-partition metrics only where cardinality is manageable. Alert on lag time rather than offset count when event rates vary widely. Choose stronger guarantees only where business correctness warrants throughput cost.

## Common failure patterns
- Monitoring throughput but not end-to-end delay
- Ignoring stalled individual partitions
- Treating replay duplicates as new incidents
- No visibility into checkpoint failure
- Alerts with no estimate of catch-up time

## Verification
Run controlled backlog, restart, and replay scenarios; confirm data loss and duplication checks remain valid.

## Expected output
Streaming health metrics, lag SLOs, anomaly alerts, and replay-aware runbooks.

## Stop conditions
Escalate when delivery semantics are undocumented or remediation could cause data loss or irreversible offset changes.
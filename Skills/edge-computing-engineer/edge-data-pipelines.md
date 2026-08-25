# Edge Data Pipelines

## Purpose
Design data pipelines that filter, transform, aggregate, buffer, and forward edge data efficiently and reliably.

## When to use
Use when processing telemetry, events, sensor streams, logs, or media before cloud ingestion.

## Inputs
Source rates, payload schemas, required transformations, bandwidth budgets, retention, delivery guarantees.

## Context to inspect
Inspect producers, local brokers, transformation stages, queue limits, timestamps, schemas, compression, and upstream contracts.

## Core knowledge
Edge pipelines must manage burstiness, schema evolution, clock quality, backpressure, local durability, bandwidth economics, and replay semantics.

## Procedure
1. Inventory sources and realistic peak rates.
2. Define canonical event schemas and timestamps.
3. Separate loss-tolerant telemetry from durable business events.
4. Filter or aggregate only where raw-data loss is acceptable.
5. Bound buffers and define overflow behavior.
6. Persist durable events before acknowledging producers.
7. Batch and compress based on measured link economics.
8. Version schemas and preserve compatibility.
9. Add data-quality and lag metrics.
10. Test burst, outage, replay, and upstream throttling scenarios.

## Decision points
Process locally when latency, privacy, or bandwidth savings justify it. Preserve raw data when future reprocessing value exceeds storage and transfer cost.

## Common failure patterns
Unbounded buffering, schema drift, silent dropping, timestamp ambiguity, duplicate replay, upstream retry storms.

## Verification
Prove expected throughput, bounded queues, correct transformations, recovery after outages, and traceable loss when configured.

## Expected output
A pipeline design with schemas, buffering, durability, transformation, and delivery rules.

## Stop conditions
Stop when required loss tolerance or retention semantics are undefined.
# Network and I/O Performance

## Purpose
Diagnose latency and throughput lost to network transfer, storage I/O, connection setup, protocol overhead, buffering, and inefficient request patterns.

## When to use
Use when CPU is not the bottleneck, traces show I/O waits, payloads are large, throughput is bandwidth-bound, or remote calls dominate latency.

## Inputs
Traces, network/storage metrics, payload sizes, protocol configuration, connection-pool metrics, topology, and workload.

## Context to inspect
Inspect DNS, TLS setup, connection reuse, HTTP versions, compression, serialization, packet loss, bandwidth, storage latency/IOPS, buffering, batching, and request fan-out.

## Core knowledge
Latency and bandwidth are separate constraints. Small chatty calls suffer round-trip cost; large transfers suffer bandwidth and serialization cost. Connection reuse and bounded buffering often matter more than low-level tuning.

## Procedure
1. Decompose end-to-end time into compute and I/O waits.
2. Identify dominant remote/storage operations.
3. Measure payload size, request count, connection acquisition, and transfer time.
4. Check connection reuse and pool saturation.
5. Inspect network path and protocol negotiation.
6. Check storage queue depth, latency, throughput, and access pattern.
7. Reduce unnecessary round trips and transferred data.
8. Evaluate batching, streaming, compression, or locality based on workload.
9. Retest under representative concurrency.
10. Validate CPU trade-offs introduced by serialization/compression changes.

## Decision points
Batch when round trips dominate and latency tolerance permits; stream when payload size or memory pressure matters; compress when bandwidth savings exceed CPU cost.

## Common failure patterns
Creating connections per request, over-compressing tiny payloads, buffering huge responses, excessive API fan-out, synchronous I/O on constrained threads, and ignoring network topology.

## Verification
Show reduced critical-path I/O time or improved throughput without unacceptable CPU, memory, or correctness cost.

## Expected output
An evidence-backed I/O bottleneck analysis and optimized transfer/access strategy.

## Stop conditions
Escalate when network or storage infrastructure is outside the authorized change boundary.
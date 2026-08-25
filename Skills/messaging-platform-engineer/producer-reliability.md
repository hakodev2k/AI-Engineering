# Producer Reliability

## Purpose
Engineer producers that publish reliably under broker failure, network instability, throttling, and application restarts without creating uncontrolled duplicates or latency spikes.

## When to use
Use when building or reviewing producer libraries, tuning acknowledgements, or investigating publish failures.

## Inputs
- Broker type and guarantees
- Throughput and latency targets
- Durability requirement
- Retry policy
- Message size distribution

## Context to inspect
Inspect acknowledgement mode, batching, compression, retry configuration, connection reuse, idempotence, timeouts, and publish error handling.

## Core knowledge
Producer reliability depends on acknowledgement strength, retries, idempotence, batching, buffer limits, connection management, and the broker's replication state.

## Procedure
1. Define acceptable loss and duplicate risk.
2. Configure acknowledgement strength to match durability needs.
3. Set bounded retries with exponential backoff and jitter.
4. Enable producer idempotence when supported and appropriate.
5. Tune batching and compression from measured traffic.
6. Set delivery, request, and connection timeouts explicitly.
7. Bound local buffers and define overload behavior.
8. Instrument publish latency, errors, retries, and queueing.
9. Test broker unavailability and leader changes.

## Decision points
Use stronger acknowledgements for durable business events; weaker settings may be acceptable for disposable telemetry. Prefer backpressure over unbounded buffering.

## Common failure patterns
- Infinite retries hiding outages
- Large local buffers causing delayed failure
- Ignoring async send failures
- Aggressive timeouts producing retry storms
- Compression chosen without CPU measurement

## Verification
Inject network loss and broker failover, verify publish error propagation, measure duplicate/loss behavior, and confirm latency under peak load.

## Expected output
A producer configuration and operational contract with measured reliability characteristics.

## Stop conditions
Stop when durability expectations are undefined, failures cannot be surfaced to callers, or the broker cannot satisfy required acknowledgement semantics.
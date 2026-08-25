# Consumer Reliability

## Purpose
Design consumers that recover safely from crashes, rebalances, poison messages, slow dependencies, and broker redelivery while preserving correctness and throughput.

## When to use
Use when implementing or reviewing consumers, tuning acknowledgement or offset commits, or investigating lag and duplicate processing.

## Inputs
- Message processing workflow
- Broker acknowledgement model
- Downstream dependencies
- Concurrency and ordering requirements
- Retry and timeout policies

## Context to inspect
Inspect commit/ack timing, consumer group behavior, processing duration, concurrency, dependency timeouts, shutdown handling, and replay characteristics.

## Core knowledge
A Senior engineer should understand consumer groups, prefetch/fetch sizing, acknowledgement boundaries, offset management, rebalancing, cooperative assignment, idempotency, poison-message isolation, and graceful shutdown.

## Procedure
1. Define the durable processing boundary.
2. Align acknowledgement or offset commit after that boundary.
3. Set bounded concurrency based on partition count and downstream capacity.
4. Configure dependency timeouts shorter than broker/session failure thresholds.
5. Implement graceful shutdown that stops intake before terminating work.
6. Separate transient failures from permanent message failures.
7. Add idempotency or deduplication where duplicates are possible.
8. Instrument processing latency, errors, lag, retries, and rebalance frequency.
9. Test crashes at each processing stage.

## Decision points
Prefer manual acknowledgement when processing correctness requires explicit control. Use auto-commit only when loss/duplicate semantics are acceptable and verified.

## Common failure patterns
- Commit before durable work completes
- Excessive concurrency overwhelming databases
- Long processing causing consumer eviction
- Rebalance loops from unstable clients
- Poison messages blocking an entire partition

## Verification
Crash consumers before and after side effects, test rolling restarts, induce slow downstream dependencies, and verify lag recovery without forbidden duplicate effects.

## Expected output
A consumer reliability design with acknowledgement, concurrency, shutdown, retry, and recovery behavior.

## Stop conditions
Stop when processing atomicity cannot be defined, downstream systems cannot tolerate retries, or ordering requirements conflict with required concurrency.
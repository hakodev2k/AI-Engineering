# Delivery Semantics

## Purpose
Choose and implement realistic message-delivery guarantees while preserving business correctness.

## When to use
Use when designing consumers, brokers, retries, acknowledgements, or correctness guarantees.

## Inputs
Broker capabilities, business invariants, failure modes, throughput, ordering and latency requirements.

## Context to inspect
Acknowledgement behavior, redelivery policy, transactions, consumer side effects, deduplication stores, and producer guarantees.

## Core knowledge
At-most-once can lose messages; at-least-once can duplicate them. End-to-end exactly-once is usually conditional on tightly scoped transactional boundaries. Business correctness should not depend on optimistic transport claims.

## Procedure
1. Identify consequences of loss and duplication.
2. Map every persistence and network boundary.
3. Select the weakest delivery guarantee that still supports correctness.
4. Make consumers idempotent where duplicates are possible.
5. Place acknowledgement after durable completion of required work.
6. Define retry and poison-message handling.
7. Add deduplication only when side effects require it.
8. Test crashes before and after each boundary.
9. Measure redelivery and duplicate rates.

## Decision points
Choose at-most-once for disposable telemetry; at-least-once for most business workflows with idempotency; transactional/exactly-once mechanisms only when their scope truly includes all required effects.

## Common failure patterns
Acknowledging too early, assuming broker exactly-once covers external APIs, unbounded dedupe state, retrying permanent failures, and conflating processing with delivery.

## Verification
Fault-injection tests prove acceptable behavior for crash, timeout, duplicate, delayed acknowledgement, and broker reconnect scenarios.

## Expected output
Documented delivery guarantees plus consumer logic that preserves business invariants.

## Stop conditions
Stop if correctness requires atomicity across unsupported resources or broker semantics are unknown.
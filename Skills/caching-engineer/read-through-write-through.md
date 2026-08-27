# Read-Through and Write-Through Caching

## Purpose
Evaluate and implement centralized cache loading or write propagation when cache infrastructure should own data movement.

## When to use
Use when many consumers need consistent caching behavior or duplicate cache-aside logic is creating risk.

## Inputs
Data access contracts, cache product capabilities, write semantics, latency targets, source availability.

## Context to inspect
Inspect cache loader APIs, transaction guarantees, retry behavior, serialization, failure modes, and current consumer patterns.

## Core knowledge
Read-through centralizes miss loading. Write-through synchronously propagates writes through the cache to the backing store. Both reduce application duplication but increase infrastructure coupling and can place cache availability on critical write paths.

## Procedure
1. Identify duplicated policies and consistency needs.
2. Confirm backend support and transactional semantics.
3. Define loader/write contract and idempotency.
4. Set timeouts and bounded retries.
5. Define behavior when cache or source is unavailable.
6. Version serialized values.
7. Protect hot misses from concurrent loader execution.
8. Instrument source and cache latency independently.
9. Test partial failures and duplicate writes.
10. Document ownership and recovery procedures.

## Decision points
Choose read-through for centralized read population. Choose write-through when immediate cache/source coordination is worth added write latency. Avoid write-through if the cache cannot provide the required durability or ordering.

## Common failure patterns
Assuming cache acknowledgment equals durable source commit; recursive loaders; hidden retry multiplication; no idempotency; making cache outage a total write outage without justification.

## Verification
Fault-test cache/source combinations and compare final authoritative state with cached state.

## Expected output
A documented centralized caching contract with verified failure semantics.

## Stop conditions
Stop when durability or transaction guarantees cannot meet business requirements.
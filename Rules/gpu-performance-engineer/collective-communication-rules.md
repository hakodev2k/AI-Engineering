# Collective Communication Rules

## Purpose
Optimize collective communication for distributed GPU workloads without compromising correctness or resilience.

## Scope
All-reduce, all-gather, reduce-scatter, broadcast, collective libraries, and communication scheduling.

## MUST
- Collective algorithms MUST be selected using topology, message size, participant count, and measured performance.
- Communication correctness MUST be validated under failures, rank changes, and supported process counts.
- Collective time MUST be measured separately from compute where overlap is claimed.
- Timeouts and failure propagation MUST be configured for production behavior.

## MUST NOT
- MUST NOT assume one collective algorithm is optimal across all message sizes and topologies.
- MUST NOT mask deadlocks with unbounded timeouts.
- MUST NOT claim overlap benefit without trace evidence.

## SHOULD
- SHOULD benchmark representative message-size distributions.
- SHOULD tune collective configuration conservatively and document environment-specific overrides.

## Exceptions
Exceptions require topology evidence, benchmark results, and rollback strategy.

## Verification
Review communication traces, collective benchmarks, failure tests, timeout settings, and topology-aware configuration.
# Messaging Architecture

## Purpose
Define safe, evolvable boundaries for broker-based systems.

## Scope
Applies to queues, topics, streams, producers, consumers, and broker topology.

## MUST
- Messaging boundaries MUST reflect explicit ownership and delivery semantics.
- Every flow MUST document producer, consumer, contract, ordering needs, retention, and failure behavior.
- Architecture changes MUST assess coupling, blast radius, operability, and migration impact.

## MUST NOT
- MUST NOT use a broker to hide unclear service ownership.
- MUST NOT assume exactly-once business outcomes from transport guarantees alone.

## SHOULD
- Prefer asynchronous messaging only when its latency, consistency, and operational trade-offs are acceptable.

## Exceptions
Exceptions require rationale, alternatives, risk, rollback strategy, and owner approval.

## Verification
Review topology diagrams, contracts, broker configuration, failure tests, and architecture decisions.
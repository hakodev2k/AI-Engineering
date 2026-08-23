# Ordering Rules

## Purpose
Control when ordering guarantees are required and prevent false global-order assumptions.

## Scope
Events, commands, replicated logs, and concurrent workflows.

## MUST
- Ordering requirements MUST be defined per key, partition, aggregate, or global domain.
- Consumers MUST reject or reconcile stale versions when order affects correctness.
- Sequence identifiers MUST have documented uniqueness and comparison semantics.

## MUST NOT
- MUST NOT infer causal order from wall-clock timestamps alone.
- MUST NOT require global ordering without quantifying scalability and availability cost.

## SHOULD
- Prefer partition-local ordering when business invariants permit it.

## Exceptions
Relaxed ordering requires documented reconciliation semantics.

## Verification
Test reordering, duplicate sequences, delayed messages, concurrent writes, and replay behavior.
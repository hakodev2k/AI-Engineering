# Multi-GPU Rules

## Purpose
Protect correctness, scalability, and failure behavior across multiple accelerators.

## Scope
Data/model parallelism, collectives, peer access, topology-aware placement, and multi-GPU services.

## MUST
- Communication topology and collective costs MUST be included in scaling decisions.
- Partitioning MUST define ownership, synchronization, and recovery behavior.
- Scaling claims MUST report efficiency relative to a documented baseline.
- Collective operations MUST use consistent participant membership, ordering, datatype, and shape assumptions.
- Failure behavior MUST be defined for a lost, reset, or unhealthy device.

## MUST NOT
- MUST NOT assume adding devices produces linear speedup.
- MUST NOT depend on peer access without capability checks and fallback behavior.
- MUST NOT silently continue after partial collective failure when state consistency is uncertain.

## SHOULD
- Place communication-heavy peers according to measured topology.
- Minimize synchronization barriers that do not protect real dependencies.

## Exceptions
Topology-specific optimizations require portable fallback and measured benefit.

## Verification
Use topology inspection, scaling benchmarks, collective correctness tests, fault injection, and communication profiling.
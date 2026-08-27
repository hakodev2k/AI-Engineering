# BPF Program Architecture

## Purpose
Design maintainable eBPF program boundaries, attachment points, maps, and user-space coordination without assuming a specific repository.

## When to use
Use when introducing or restructuring eBPF-based observability, networking, security, or profiling capabilities.

## Inputs
Requirements, kernel targets, attachment points, event-rate expectations, privilege model, existing loaders and maps.

## Context to inspect
Inspect supported kernels, BTF availability, program types, verifier constraints, user-space consumers, deployment model, and failure policy.

## Core knowledge
Senior design balances verifier complexity, kernel/user-space responsibility, map lifetime, event volume, compatibility, and blast radius. Keep kernel programs small and deterministic; move enrichment and expensive aggregation to user space when practical.

## Procedure
1. Define the operational question and required kernel signals.
2. Select the least invasive stable hook that exposes the required context.
3. Partition kernel collection, map state, and user-space processing.
4. Define map keys, values, ownership, cardinality, and lifecycle.
5. Define event schema and compatibility strategy.
6. Bound loops, memory, stack, and per-event work.
7. Design feature detection and fallback behavior.
8. Add telemetry for load, attach, drops, and consumer health.
9. Validate verifier acceptance and representative kernel compatibility.
10. Document privileges, rollback, and operational limits.

## Decision points
Prefer tracepoints over less-stable probes when equivalent. Prefer ring buffers for ordered variable event streams where supported; maps suit shared state and aggregation. Choose kernel aggregation only when reduced event volume justifies verifier and correctness complexity.

## Common failure patterns
Monolithic programs, unstable hooks without fallback, unbounded map cardinality, ABI drift, excessive per-event work, hidden privilege assumptions, and no degradation path.

## Verification
Implementation exists only when programs load and attach. Verification requires representative kernels, expected event semantics, bounded overhead, map pressure tests, consumer failure tests, and clean detach.

## Expected output
An architecture with explicit hooks, program/map boundaries, event contracts, compatibility assumptions, and operational safeguards.

## Stop conditions
Stop when required hooks are unavailable, verifier constraints invalidate the design, privileges cannot be approved, or measured overhead exceeds the agreed budget.
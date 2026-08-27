# Runtime API and Shim Design

## Purpose
Design stable runtime APIs and shim/supervisor boundaries that isolate lifecycle ownership, survive daemon restarts, and evolve compatibly.

## When to use
Use for runtime service APIs, shim protocols, versioning, event delivery, or component-boundary refactors.

## Inputs
Call graph, lifecycle model, protocol schema, compatibility requirements, restart behavior, latency/failure SLOs.

## Context to inspect
Inspect client/daemon/shim/runtime ownership, socket lifecycle, process supervision, event persistence, cancellation, timeouts, and version negotiation.

## Core knowledge
A shim can decouple container survival and exit collection from a central daemon. APIs should encode explicit state transitions and stable identities. Retries require idempotency or request identity.

## Procedure
1. Assign lifecycle/resource ownership to one component each.
2. Define operations and legal states.
3. Specify request IDs, timeouts, cancellation, and retry semantics.
4. Separate transport errors from runtime operation errors.
5. Define event ordering/delivery guarantees.
6. Design daemon and shim restart reconciliation.
7. Version protocol fields compatibly.
8. Bound message sizes and validate untrusted inputs.
9. Test old/new component combinations.
10. Inject disconnects at every operation phase.

## Decision points
Keep shims minimal but sufficiently autonomous to supervise workloads. Add APIs only for stable runtime capabilities rather than leaking implementation details.

## Common failure patterns
Ambiguous ownership, retrying non-idempotent create, lost exit events, infinite timeouts, protocol fields tied to local paths, and daemon restart killing workloads.

## Verification
Compatibility tests, disconnect/restart tests, lifecycle invariants, and no resource/event loss under retries.

## Expected output
A versioned runtime/shim contract with explicit failure semantics.

## Stop conditions
Stop when ownership is ambiguous or protocol changes require breaking existing clients without a migration plan.
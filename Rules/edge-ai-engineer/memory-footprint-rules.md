# Memory Footprint Rules

## Purpose
Prevent edge inference failures caused by memory pressure, fragmentation, or unbounded working sets.

## Scope
Model weights, activations, caches, buffers, native allocations, and application co-tenancy.

## MUST
- Peak memory MUST be measured on representative devices under realistic workloads.
- Memory budgets MUST include model, runtime, application, and temporary allocation overhead.
- Repeated inference MUST be tested for leaks and fragmentation growth.
- Allocation failure behavior MUST be defined and safe.

## MUST NOT
- MUST NOT size memory from model file size alone.
- MUST NOT assume startup success proves sustained memory safety.

## SHOULD
- Reuse buffers and bounded caches where this reduces pressure without harming correctness.

## Exceptions
Budget overruns require measured justification, affected-device scope, mitigation, and approval.

## Verification
Inspect device memory traces, stress tests, leak checks, allocation profiles, and long-running soak tests.
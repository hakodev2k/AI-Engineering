# Side-Channel-Resistant Implementation

## Purpose
Reduce leakage of secret-dependent information through timing, cache, memory-access, branch, power, or related implementation channels.

## When to use
Use when implementing or reviewing secret-dependent cryptographic operations, especially on shared hardware, embedded devices, or attacker-observable endpoints.

## Inputs
Implementation code, cryptographic library, hardware/runtime, attacker proximity, secret operations, and performance constraints.

## Context to inspect
Secret-dependent branches/indexes, comparison code, compiler behavior, big-integer APIs, caches, error timing, memory clearing, hardware accelerators, and remote observability.

## Core knowledge
Constant-time behavior is an implementation property, not merely a coding style. Compilers, runtimes, microarchitecture, variable-time library calls, and protocol errors can reintroduce leakage.

## Procedure
1. Identify secrets and attacker-observable operations.
2. Prefer vetted constant-time library implementations.
3. Remove secret-dependent branches, table indexes, and early exits where relevant.
4. Use constant-time comparison APIs.
5. Review variable-time big-integer and parsing operations.
6. Minimize secret lifetime and copies in memory.
7. Normalize error behavior where it could become an oracle.
8. Inspect compiler/runtime guarantees for sensitive paths.
9. Benchmark statistically for timing correlation where meaningful.
10. Add regression checks and document residual physical-channel assumptions.

## Decision points
Remote timing risk differs from local physical side channels; choose mitigations according to attacker model. Managed/runtime languages may require moving critical operations into vetted native/library primitives rather than hand-written constant-time code.

## Common failure patterns
Early-exit secret comparison; secret-indexed lookup tables; variable-time scalar operations; assuming network noise eliminates timing attacks; compiler optimizing masking logic; secret-dependent errors.

## Verification
Use code review, known constant-time tooling where available, repeated timing distributions, and platform-specific side-channel tests proportional to risk.

## Expected output
A leakage review identifying sensitive operations, mitigations, evidence, and residual assumptions.

## Stop conditions
Stop if the platform cannot provide required leakage guarantees for the threat model or custom low-level crypto would be needed without specialist review.
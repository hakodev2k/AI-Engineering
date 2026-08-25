# Cryptographic Performance Engineering

## Purpose
Meet latency, throughput, CPU, memory, and capacity targets without weakening cryptographic guarantees.

## When to use
Use for high-volume encryption/signing, TLS bottlenecks, HSM/KMS capacity, password hashing, mobile/embedded constraints, or performance regressions.

## Inputs
Workload profile, security requirements, SLOs, benchmarks, hardware, library versions, key architecture, and concurrency model.

## Context to inspect
Payload sizes, operation mix, handshake/session behavior, hardware acceleration, batching, KMS/HSM calls, allocations, network latency, and cache behavior.

## Core knowledge
Optimize architecture and safe implementation before changing security parameters. Crypto costs vary by message size, hardware, concurrency, key type, and remote key-service latency.

## Procedure
1. Establish representative workloads and security invariants.
2. Measure end-to-end latency and throughput before microbenchmarking.
3. Attribute cost to primitive, serialization, network, KMS/HSM, allocation, or contention.
4. Confirm hardware acceleration and optimized library paths.
5. Reduce unnecessary crypto operations and remote calls.
6. Consider safe batching, session reuse, or bounded key caching.
7. Tune password-KDF cost only against explicit security and capacity budgets.
8. Load-test failure and throttling behavior.
9. Compare alternatives without weakening required properties.
10. Record baseline, improvement, and security review of changes.

## Decision points
Scale out remote signing/KMS when latency is external; use local envelope encryption for bulk data. Prefer algorithm changes only when standards, compatibility, lifecycle, and security are all reviewed.

## Common failure patterns
Shorter keys to fix latency; disabling certificate checks; unbounded key caches; benchmarks on tiny unrealistic payloads; ignoring tail latency; optimizing primitive while KMS dominates.

## Verification
Re-run representative benchmarks and load tests, confirm security invariants unchanged, and inspect p95/p99 plus failure-mode behavior.

## Expected output
A measured optimization plan with bottleneck evidence, safe changes, capacity margins, and regression thresholds.

## Stop conditions
Stop if performance targets require violating minimum security policy or measurements are not representative enough to justify changes.
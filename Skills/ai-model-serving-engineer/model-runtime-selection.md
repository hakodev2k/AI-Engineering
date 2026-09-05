# Model Runtime Selection

## Purpose
Select an inference runtime that matches model architecture, hardware, performance targets, deployment constraints, and operational maturity.

## When to use
Use for new deployments, runtime migrations, hardware changes, or persistent serving inefficiency.

## Inputs
Model formats, supported operators, hardware, precision requirements, latency/throughput targets, ecosystem constraints, and deployment platform.

## Preconditions
Representative models and workloads must be benchmarkable on candidate runtimes.

## Context to inspect
Runtime compatibility, kernel coverage, quantization support, batching, speculative decoding, distributed inference, observability, upgrade cadence, and community/vendor support.

## Core knowledge
Runtime benchmarks are workload-specific. Compatibility gaps, unsupported operators, graph breaks, and weak observability can outweigh synthetic speedups.

## Procedure
1. Define functional and operational requirements.
2. Shortlist runtimes that support the model and hardware.
3. Verify model loading and numerical correctness.
4. Benchmark representative sequence lengths and concurrency.
5. Evaluate batching, streaming, distributed execution, and quantization.
6. Test failure behavior, reloads, and upgrades.
7. Compare operational complexity and supportability.
8. Select based on measured total-system performance and risk.

## Decision points
Prefer mature, observable runtimes unless a specialized runtime provides material validated benefit.

## Common failure patterns
Choosing from headline benchmarks, ignoring unsupported model features, and failing to test upgrades or rollback.

## Verification
Confirm correctness parity, target SLOs, stable load behavior, and operable failure recovery.

## Expected output
A runtime decision with benchmarks, compatibility findings, risks, and migration plan.

## Stop conditions
Reject candidates with correctness drift, unsupported required features, or unacceptable operational risk.
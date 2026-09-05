# Speculative Decoding

## Purpose
Evaluate and deploy speculative decoding to reduce token-generation latency while preserving output quality and operational predictability.

## When to use
Use when decode latency dominates and candidate draft models or native speculative techniques are available.

## Inputs
Target model, draft model or speculation method, acceptance rates, sequence lengths, hardware, runtime support, latency targets, quality tests.

## Preconditions
Baseline decoding performance and correctness are measured.

## Context to inspect
Draft-target compatibility, tokenizer alignment, acceptance policy, scheduler interaction, batching, memory overhead, and runtime implementation.

## Core knowledge
Speculation helps only when accepted draft tokens outweigh added draft compute and coordination. Benefits vary by workload, model pair, batch size, and hardware.

## Procedure
1. Measure baseline decode latency and tokens/sec.
2. Select compatible speculation candidates.
3. Measure acceptance rate by workload segment.
4. Benchmark end-to-end latency under realistic concurrency.
5. Check memory and scheduler overhead.
6. Evaluate quality and determinism expectations.
7. Test failure and fallback behavior.
8. Canary with detailed latency and acceptance metrics.
9. Keep speculation only where net benefit is sustained.

## Decision points
Disable speculation for workloads with low acceptance or where added complexity does not improve user-visible latency.

## Common failure patterns
Benchmarking single requests only, ignoring draft-model cost, assuming acceptance is uniform, and overlooking batching interactions.

## Verification
Confirm improved p50/p95 decode latency without quality regression or capacity loss under representative load.

## Expected output
A speculation configuration, measured benefit, supported workload segments, and rollback rule.

## Stop conditions
Stop when runtime instability, poor acceptance, or operational complexity exceeds measured benefit.
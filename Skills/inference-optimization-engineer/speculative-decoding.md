# Speculative Decoding

## Purpose
Reduce autoregressive generation latency by using a draft mechanism to propose tokens that the target model verifies efficiently.

## When to use
Use for latency-sensitive generative workloads where target-model decode is the dominant cost and runtime support is mature enough for safe deployment.

## Inputs
Target model, draft model or speculation method, acceptance-rate measurements, token-length distribution, runtime support, quality requirements, and hardware profile.

## Context to inspect
Inspect draft cost, verification kernels, acceptance rate by workload class, tokenizer compatibility, batching interaction, memory overhead, and fallback behavior.

## Core knowledge
Speculation helps only when accepted tokens amortize draft and verification overhead. Acceptance varies by domain, temperature, sampling settings, and draft quality. Exact methods preserve the target distribution when implemented correctly; approximations require explicit quality evaluation.

## Procedure
1. Establish target-only decode baseline.
2. Select a compatible draft strategy.
3. Measure draft latency and memory overhead.
4. Measure accepted tokens per verification step by workload segment.
5. Tune speculation length.
6. Benchmark short and long generations under realistic concurrency.
7. Verify sampling semantics and output distribution.
8. Test interactions with batching and KV cache.
9. Add automatic fallback when speculation is ineffective or unhealthy.
10. Monitor acceptance rate and end-to-end speedup in production.

## Decision points
Use smaller/faster drafts when verification gains outweigh reduced acceptance. Disable speculation for workload classes with persistently poor acceptance. Prefer runtime-native implementations over custom orchestration when equivalent.

## Common failure patterns
Optimizing acceptance rate instead of end-to-end latency, ignoring draft memory, using incompatible tokenizers, assuming one speculation length fits all prompts, and failing to validate stochastic decoding behavior.

## Verification
Verified means end-to-end decode latency improves under representative traffic and output semantics remain within the approved correctness or distribution contract.

## Expected output
Speculation configuration, acceptance analysis, benchmark results, fallback criteria, and monitoring thresholds.

## Stop conditions
Escalate when tokenizer/model compatibility is uncertain, exactness requirements cannot be demonstrated, or speculation increases tail latency under realistic load.
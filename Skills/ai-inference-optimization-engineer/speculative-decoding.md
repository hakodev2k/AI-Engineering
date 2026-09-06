# Speculative Decoding

## Purpose
Reduce autoregressive generation latency by using a cheaper draft model or mechanism to propose tokens that a target model verifies efficiently.

## When to use
Use for decoder-heavy workloads where token generation dominates latency and a compatible speculative strategy is available.

## Inputs
Target model, draft model or speculation method, tokenizer compatibility, runtime support, workload distribution, quality requirements, and latency baseline.

## Context to inspect
Inspect acceptance rate, draft speed, verification cost, sequence lengths, sampling settings, tokenizer identity, memory overhead, and batching interaction.

## Core knowledge
Speculation helps only when accepted-token savings exceed draft and verification overhead. Acceptance varies by task, temperature, prompt domain, and draft quality. Correct implementations preserve target-model sampling semantics.

## Procedure
1. Measure decode-phase latency and tokens/sec without speculation.
2. Confirm runtime and model compatibility.
3. Select a draft strategy with materially lower per-token cost.
4. Start with conservative speculative token counts.
5. Measure acceptance rate by workload cohort.
6. Sweep speculation depth and draft configuration.
7. Verify target-model output semantics and quality.
8. Test interaction with batching, streaming, cancellation, and long contexts.
9. Compare p50/p95 latency, throughput, memory, and cost.
10. Disable speculation automatically for cohorts where overhead exceeds benefit.

## Decision points
Use a smaller draft model when acceptance is high enough and memory permits. Use adaptive speculation when acceptance varies strongly by request type. Avoid speculation for extremely short outputs where setup overhead dominates.

## Common failure patterns
Assuming high acceptance from one benchmark, using incompatible tokenizers, measuring throughput without user-perceived latency, excessive draft depth, and changing sampling semantics unintentionally.

## Verification
Confirm identical or contract-equivalent target semantics, stable streaming behavior, and statistically significant latency improvement on production-shaped traffic.

## Expected output
A speculative decoding policy with supported workloads, configuration, measured acceptance, and fallback rules.

## Stop conditions
Stop when quality or sampling semantics change unexpectedly, acceptance is too low, memory overhead causes instability, or runtime correctness cannot be verified.
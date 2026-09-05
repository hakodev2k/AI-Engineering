# Speculative Decoding

## Purpose
Reduce autoregressive generation latency by drafting tokens cheaply and verifying them with the target model.

## When to use
For decode-bound generative models where compatible draft or self-speculation methods exist.

## Inputs
Target model, draft strategy/model, tokenizer compatibility, workloads, hardware, baseline token latency and quality.

## Preconditions
Target output distribution/quality must remain equivalent within the serving method's guarantees.

## Context to inspect
Inspect acceptance rate, draft cost, verification kernels, batch effects, sequence lengths, tokenizer, memory, and scheduler.

## Core knowledge
Benefit depends on accepted tokens per verification step minus draft overhead. A strong but expensive drafter can be slower; workload and batching change the optimum.

## Procedure
1. Establish decode baseline.
2. Select compatible draft strategy.
3. Sweep draft length and configuration.
4. Measure acceptance rate and verification cost.
5. Test across prompt/generation distributions.
6. Measure TTFT, inter-token latency, throughput, memory, and cost.
7. Verify output semantics/quality.
8. Test interaction with batching and cache management.
9. Define fallback when acceptance collapses.
10. Roll out with comparative telemetry.

## Decision points
Use speculative decoding when decode dominates and acceptance is high enough. Prefer simpler decoding when draft overhead or memory reduces overall capacity.

## Common failure patterns
Reporting theoretical accepted-token speedup, ignoring batching degradation, incompatible tokenization, extra memory pressure, and evaluating only easy prompts.

## Verification
End-to-end production-like tests show statistically significant latency/cost gains without quality or reliability regression.

## Expected output
Draft configuration, acceptance analysis, benchmarks, workload boundaries, and fallback criteria.

## Stop conditions
Stop when acceptance is consistently poor, memory/cost increases negate gains, or correctness guarantees cannot be established.
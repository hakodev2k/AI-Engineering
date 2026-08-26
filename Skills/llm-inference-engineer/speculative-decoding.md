# Speculative Decoding

## Purpose
Evaluate and deploy speculative decoding to reduce generation latency without changing output semantics beyond accepted sampling behavior.

## When to use
Use when decode latency dominates and compatible draft/speculation mechanisms are available.

## Inputs
Target model, draft model or speculation method, sampling settings, workload traces, hardware, and latency/cost targets.

## Context to inspect
Acceptance-rate metrics, tokenizer compatibility, draft placement, memory overhead, batch interaction, and runtime implementation.

## Core knowledge
Speculation helps when accepted draft tokens offset draft and verification cost. Benefits vary by workload, sampling temperature, model pair, batch size, and hardware utilization.

## Procedure
1. Establish decode baseline by request class.
2. Select a compatible speculation method and pin all model/tokenizer revisions.
3. Measure acceptance length/rate across representative prompts.
4. Tune speculative token count rather than maximizing it.
5. Measure target verification cost and added memory.
6. Test interaction with continuous batching and high concurrency.
7. Compare p50/p95 latency, throughput, cost, and output quality.
8. Add runtime guardrails to disable speculation when it becomes counterproductive.
9. Canary and observe acceptance drift over real traffic.

## Decision points
Use speculation for decode-bound workloads with adequate acceptance. Avoid it when batches already saturate hardware, draft overhead is high, or quality/compatibility cannot be proven.

## Common failure patterns
Reporting only single-request speedups, ignoring draft GPU cost, tokenizer mismatch, and static settings across heterogeneous traffic.

## Verification
Confirm latency improvement under production concurrency, semantic/quality gates, and safe fallback to ordinary decoding.

## Expected output
Measured speculation policy, enablement criteria, and rollback controls.

## Stop conditions
Stop when acceptance is too low or runtime behavior changes correctness outside approved tolerance.
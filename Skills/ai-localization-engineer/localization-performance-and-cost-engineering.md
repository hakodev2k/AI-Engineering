# Localization Performance and Cost Engineering

## Purpose
Optimize multilingual AI delivery for latency, throughput, token use, translation overhead, storage, and provider cost without sacrificing locale quality.

## When to use
Use when multilingual expansion raises latency or cost, when routing changes are proposed, or when locale-specific workloads scale unevenly.

## Inputs
Traffic by locale, model/token metrics, translation and retrieval costs, latency traces, cache behavior, provider pricing, quality thresholds, and SLOs.

## Preconditions
Baseline cost and latency can be measured by locale and request path.

## Context to inspect
Inspect prompt lengths, tokenization, model routing, translation calls, retrieval indexes, caches, speech services, batching, concurrency, and fallback patterns.

## Core knowledge
Tokenization efficiency differs by language; a prompt that is cheap in English may be materially more expensive elsewhere. Added translation hops, cross-region calls, speech processing, and low cache hit rates can dominate latency. Optimization must preserve semantic and safety quality.

## Procedure
1. Establish latency and cost baselines per locale and workflow.
2. Decompose time and spend across model, translation, retrieval, network, speech, and review components.
3. Identify locale-specific token inflation and redundant transformations.
4. Measure cache opportunities using locale-safe keys.
5. Compare direct multilingual inference with translate-in/translate-out architectures.
6. Evaluate smaller models or routing only against locale quality gates.
7. Load-test representative language mixes.
8. Implement the highest-value changes incrementally.
9. Re-measure quality, latency, and cost after each change.

## Decision points
Prefer direct multilingual inference when quality is adequate and translation hops add latency or drift. Use translation-mediated paths when model quality gains outweigh added cost and semantic risk. Cache only content safe to reuse within the correct locale and authorization scope.

## Common failure patterns
Optimizing from English token counts, cross-locale cache pollution, removing context that carries essential terminology, comparing providers without full pipeline cost, and reducing latency at the expense of severe-error rate.

## Verification
Demonstrate measured improvement against the same locale workload while all quality, safety, and correctness thresholds remain satisfied.

## Expected output
A locale-segmented performance and cost analysis with verified optimizations and documented trade-offs.

## Stop conditions
Stop when optimization requires weakening mandatory quality or safety controls, or when production measurements are insufficient to establish causality.
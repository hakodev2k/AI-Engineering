# AI Caching

## Purpose
Reduce latency and cost by safely reusing model, retrieval, or intermediate results when requests are sufficiently equivalent.

## When to use
Use for repeated prompts, embeddings, retrieval queries, deterministic enrichments, or expensive stable generations.

## Inputs
Request patterns, freshness rules, privacy constraints, cache store, model/prompt versions, expected reuse rate.

## Preconditions
Define which outputs are safe to reuse and the exact freshness/identity rules.

## Context to inspect
Prompt construction, tenant/user boundaries, model settings, retrieval version, authorization, invalidation events, current latency/cost.

## Core knowledge
Caching AI output is riskier than caching deterministic data. Keys must include behavior-changing inputs and version dimensions. Personalized or permission-sensitive results require strict isolation. Semantic caches trade correctness for hit rate.

## Procedure
1. Identify expensive repeatable stages.
2. Define equivalence and freshness requirements.
3. Build keys from normalized inputs, model/prompt/index versions, and security scope.
4. Exclude sensitive or highly personalized outputs unless isolation is proven.
5. Set TTL and invalidation rules.
6. Prevent cache stampedes for popular misses.
7. Measure hit rate, stale-result rate, latency, and savings.
8. Test version changes and permission boundaries.
9. Add bypass mechanisms for debugging and critical freshness.

## Decision points
Use exact caches when request equivalence is strict. Use semantic caches only for low-risk tasks with evaluated similarity thresholds. Prefer caching embeddings or retrieval before final prose when answer freshness matters.

## Common failure patterns
Cross-tenant leakage, incomplete cache keys, stale knowledge, caching nondeterministic unsafe content, and ignoring model/prompt version changes.

## Verification
Run isolation, invalidation, version-change, and freshness tests; compare cost and latency with baseline.

## Expected output
A documented cache policy with safe keys, invalidation, metrics, and measured benefit.

## Stop conditions
Stop when reuse can expose another user’s data or freshness requirements cannot be enforced.
# Skill: Cache Prefix Analysis

## Purpose
Identify the longest stable, correctness-required prefix across comparable model requests and select evidence-based cache-breakpoint candidates.

## Trigger
Low cached-token ratio, higher input cost/latency, prompt restructuring, new file/RAG/tool content, or migration to explicit prompt caching.

## Inputs
Ordered request blocks, request class, model/provider, usage input tokens, cached tokens, optional latency/cost, and quality evaluation results.

## Preconditions
Compare requests that perform the same logical task class. Preserve exact block order used by the provider-facing request.

## Required context
System/developer instructions, tool schemas, reusable reference material, dynamic user content, file/reference representation, and provider adapter path.

## Allowed tools
Read request manifests and usage logs; run `scripts/cache_prefix_profiler.py`; inspect provider documentation; execute non-destructive benchmark/evaluation requests.

## Constraints
- Never remove correctness-required context only to improve cache ratio.
- Never log raw secrets or sensitive payloads.
- Treat provider usage fields as optional; report missing observability explicitly.
- Compare like-for-like request classes before drawing conclusions.

## Procedure
1. Capture at least the configured minimum number of comparable requests.
2. Represent each provider-facing request as ordered named blocks.
3. Label blocks `static-required`, `dynamic-required`, `optional`, or `volatile`.
4. Hash normalized block contents without persisting raw sensitive values.
5. Compare manifests and locate the first changed block for each pair.
6. Compute the common stable prefix and its approximate size.
7. Compute cached-token ratio when usage is available.
8. Identify whether volatile content appears before stable-required content.
9. Form a structural hypothesis: reorder only when semantics permit, replace repeated inline payloads with stable references where supported, stabilize generated tool/instruction text, or add an explicit breakpoint at the end of the stable required prefix.
10. Benchmark before/after on the same request set.
11. Run quality regression checks; reject changes that lose required context or exceed the configured regression threshold.

## Decision points
- Stable prefix already large + low cache ratio: investigate provider/adapter behavior and usage reporting before prompt surgery.
- Early volatile block: consider legal reordering or dynamic loading.
- File/blob dominates changed content: compare inline versus stable reference representation.
- Tool schema changes: stabilize deterministic schema generation.
- Missing usage metrics: instrumentation is required before claiming improvement.

## Expected output
Stable-prefix boundary, first-divergence report, block-change frequencies, cached-token ratios, candidate breakpoint locations, and verification status.

## Metrics
Cached-token ratio, stable-prefix size, input tokens/task, latency/task, cost/task if available, output-token growth, and quality regression rate.

## Verification
Use a fixed benchmark corpus and compare at least three repeated requests per request class. Accept optimization only if cache/token metrics improve and quality remains within policy.

## Failure handling
If provider transformations make request structure unavailable, capture the last application-visible payload and mark the adapter as an unobserved boundary. Do not infer cache behavior without usage evidence.

## Stop conditions
Stop after a verified improvement, after two structural hypotheses fail to improve metrics, or when required context prevents further safe reordering/compression.

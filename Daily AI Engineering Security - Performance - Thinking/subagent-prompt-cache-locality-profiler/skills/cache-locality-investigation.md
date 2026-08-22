# Skill — Cache Locality Investigation

## Purpose
Find and reduce structural prompt-cache waste caused by subagent fan-out, unstable shared prefixes, tool-manifest drift, or cache-key/TTL topology.

## Trigger
High cache-creation spend, sudden token-cost regression, scaling from sequential to parallel agents, model/client upgrade, or unexpected child-agent token growth.

## Inputs
Deduplicated/rawd JSONL usage telemetry, dispatch topology, model/client version, agent type, tool-manifest hash, context composition, latency, quality outcome, and threshold policy.

## Preconditions
Define one representative workload and quality oracle. Capture request IDs so streaming duplicates can be removed. Do not change the workload while measuring a hypothesis.

## Required context
Provider cache semantics, fan-out graph, stable vs dynamic prompt components, tool-definition generation, model selection, TTL/session behavior, and whether child contexts are copied or retrieved.

## Allowed tools
Transcript parsers, `scripts/cache_locality_profiler.py`, usage APIs/logs, source inspection, deterministic hashing, benchmark/eval harnesses.

## Constraints
Never remove correctness-critical context or security instructions solely for token reduction. Do not infer cache keys from cost alone when telemetry can verify behavior.

## Procedure
1. Collect a baseline across at least one full dispatch group; preserve request IDs, child identity, and cache usage fields.
2. Deduplicate streaming/request repeats.
3. Run the profiler and rank dispatch groups by cache creation, cache-write share, and sibling write amplification.
4. Inspect the worst group for stable-prefix duplication, child-specific prompt deltas, tool-order/schema changes, model changes, TTL gaps, or isolated cache namespaces.
5. Form one testable hypothesis such as “stable tool manifest varies across siblings” or “large parent criteria are copied into every child.”
6. Implement one structural change: stabilize shared prefix/tool manifest; retrieve shared context on demand; move small dynamic data after stable content where supported; reuse a suitable agent session; or bound/serialize fan-out.
7. Re-run the same workload and profiler with `--baseline`.
8. Reject the optimization if quality regresses, required context disappears, or security/tool boundaries weaken.
9. If thresholds remain violated, perform at most one additional changed hypothesis attempt.
10. Hand the results to the independent benchmark verifier.

## Decision points
- High creation + many manifest variants: stabilize tool configuration first.
- High creation + identical manifests + many siblings: investigate cache namespace/breakpoint/fan-out topology.
- Healthy cache but high total read tokens: optimize fan-out/context volume separately; do not misclassify as cache creation failure.
- Lower tokens with lower quality: reject.

## Expected output
Baseline and candidate JSON reports, hotspot ranking, root-cause evidence, changed hypothesis, before/after token/latency/quality metrics, and verification status.

## Metrics
Cache creation/read/uncached tokens per task and sibling, cache-write share, sibling write amplification, cost/task, latency/task, and quality pass rate.

## Verification
Comparable workload; deduplicated records; thresholds pass or documented exception; quality does not regress; independent verifier reproduces the comparison.

## Failure handling
Record the failing group and evidence. Retry at most twice with a changed hypothesis. If provider/runtime cache behavior is not controllable, cap fan-out or context replication and document the residual limitation.

## Stop conditions
Stop when thresholds and quality criteria pass, or when two changed hypotheses fail, required telemetry is unavailable, or further optimization would remove required context/security controls.

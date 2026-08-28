# Skill: Context Cache Audit

## Purpose
Measure whether prompt/tool-prefix instability is causing avoidable uncached tokens or latency.

## Trigger
Use after changes to tool registration, MCP discovery, prompt serialization, context compaction, provider adapters or cache policy.

## Inputs
Representative JSONL request traces, target budget, prompt/tool assembly code, quality-regression results.

## Preconditions
A representative workload exists and cache telemetry is available or can be normalized into `prompt_tokens` and `cached_tokens`.

## Required context
Stable system instructions, tool declarations, dynamic messages, provider cache semantics, task-quality baseline.

## Allowed tools
Read-only trace inspection, `scripts/context_cache_analyzer.py`, local tests and provider usage telemetry.

## Constraints
- MUST preserve correctness-critical context.
- MUST compare equivalent workloads.
- MUST NOT claim optimization from cost estimates without measured traces.

## Procedure
1. Capture baseline traces before changing prompt assembly.
2. Run the analyzer and record cache-hit ratio, schema bytes, order drift and latency.
3. Inspect groups where the canonical tool set is identical but ordered fingerprints differ.
4. Form one explicit hypothesis: ordering drift, schema-content drift, volatile-prefix placement or unnecessary discovery.
5. Implement the smallest change that stabilizes the prefix.
6. Re-run the same workload and analyzer.
7. Compare uncached tokens, TTFT, total latency and quality.
8. Hand evidence to the independent Verification Agent.

## Decision points
If quality falls below policy, reject the optimization. If tool availability becomes insufficient, restore required tools and diagnose selection policy separately. If cache metrics do not improve after two attempts, stop and escalate.

## Expected output
Baseline report, hypothesis, before/after report, quality evidence and verification status.

## Metrics
Cache hit ratio, uncached tokens/task, schema bytes/request, order-drift groups, TTFT p50/p95, latency p95 and quality pass rate.

## Verification
A separate verifier must reproduce analyzer results and check that required context/tools remain available.

## Failure handling
Restore the last known-good prompt assembly, preserve traces, and record why the hypothesis failed.

## Stop conditions
Stop after 2 unsuccessful optimization iterations, any correctness regression, missing evidence, or any attempt to save tokens by weakening required security/context controls.

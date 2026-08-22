# Skill — Cache-Aware Context Analysis

## Purpose
Measure whether a prompt-compression strategy actually improves production economics while preserving cache reuse and correctness.

## Trigger
Run before adopting a new compression strategy, changing prompt order, adding tool schemas, migrating models/providers, or modifying RAG context assembly.

## Inputs
- Ordered prompt segments with labels: `stable`, `dynamic`, or `protected`
- Baseline usage/latency records
- Candidate usage/latency records
- Quality evaluation results
- `config/policy.json`

## Preconditions
The same benchmark cases MUST be executed against baseline and candidates. Usage data SHOULD come from provider responses rather than local estimates.

## Required context
Provider caching semantics, prompt segment order, benchmark definition, and pricing assumptions used by the organization.

## Allowed tools
Provider usage APIs/logs, deterministic scripts, benchmark harnesses, diff tools, and read-only repository inspection.

## Constraints
- MUST NOT compress `protected` segments.
- MUST NOT claim savings using raw input-token reduction alone.
- MUST include quality and critical-context checks.
- MUST preserve ordering of stable prefix segments unless a benchmark proves an alternative is better.

## Procedure
1. Record baseline input tokens, cached tokens, cache-write tokens if available, TTFT, total latency, and quality.
2. Split the prompt into stable, dynamic, and protected segments.
3. Detect volatile content appearing before stable content.
4. Generate at most the configured number of candidates.
5. Prefer candidates that keep stable reusable content contiguous at the beginning.
6. Compress only eligible dynamic/stable content; never protected context.
7. Run identical benchmark cases.
8. Execute `scripts/cache_compression_gate.py` on aggregated metrics.
9. Accept only candidates satisfying every blocking threshold.
10. Record the winning strategy and evidence.

## Decision points
- If quality regression exceeds policy: reject.
- If any critical-context case fails: reject.
- If effective cost improvement is below threshold: reject.
- If latency regression exceeds threshold: reject.
- If cache hit ratio falls below threshold without compensating verified benefit: reject.

## Expected output
A measurable accept/reject decision with failed metrics and a reproducible benchmark record.

## Metrics
Effective cost/task, cache-hit ratio, input tokens, cached tokens, cache-write tokens, TTFT, end-to-end latency, quality score, critical-context failures.

## Verification
A separate verifier reruns the chosen candidate on the same benchmark set and confirms reported metrics.

## Failure handling
Invalid/missing usage fields block acceptance. Provider fields unavailable for a metric must be explicitly marked unavailable rather than estimated silently.

## Stop conditions
Stop after `max_candidates` candidates or immediately when one candidate passes all configured gates and independent verification confirms it.
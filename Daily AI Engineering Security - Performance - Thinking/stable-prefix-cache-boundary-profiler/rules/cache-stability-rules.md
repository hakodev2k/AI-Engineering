# Rules: Cache Stability

- Baseline measurement MUST exist before a cache optimization is accepted.
- Comparable runs MUST use the same task class, model, relevant provider settings, and acceptance criteria.
- Prompt components intended to be cache-stable MUST be rendered deterministically.
- Collections inside stable prompt components MUST use deterministic ordering.
- Volatile values such as timestamps, random IDs, ephemeral paths, runtime counters, and changing environment summaries SHOULD be placed after stable reusable components when correctness permits.
- Required security policy, task requirements, authorization context, and correctness evidence MUST NOT be removed, weakened, or moved to an ineffective location merely to improve cache metrics.
- Provider-specific explicit breakpoints MUST NOT be emitted unless provider/model capability is confirmed.
- Cache keys MUST NOT contain secrets or personal data.
- A cache optimization MUST compare cached tokens, cache-write tokens, ordinary uncached input, latency, and quality when those fields are available.
- A reported improvement MUST include sample count and before/after values.
- Cache-hit observations MUST NOT be represented as provider guarantees.
- Context compaction, resume, fork, and subagent paths SHOULD be benchmarked separately because they may change cache lineage.
- A candidate MUST fail verification when quality regression exceeds `maximum_regression_percent` or any critical context disappears.
- Optimization loops MUST stop after `maximum_optimization_attempts` unsuccessful hypotheses.
- Final verification SHOULD be performed by an agent/person that did not implement the prompt-layout change.

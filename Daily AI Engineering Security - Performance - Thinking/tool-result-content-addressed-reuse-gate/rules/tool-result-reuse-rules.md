# Tool Result Reuse Rules

- The runtime MUST execute the tool before deciding whether to reuse a prior model-visible result identity.
- Only tools explicitly classified as read-only MUST be eligible for payload elision.
- Side-effecting tools and tools with unknown effects MUST NOT be elided.
- Error or unsuccessful results MUST NOT be elided.
- The reuse identity MUST include tool name, deterministic normalized arguments, and fresh output content.
- Changed output MUST be emitted in full.
- A reuse marker MUST NOT be emitted unless the prior full payload is provably visible in the active context epoch.
- Context compaction, pruning, migration, reset, or uncertain retention MUST invalidate affected visibility leases.
- After visibility invalidation, the next fresh result MUST be emitted in full before reuse can resume.
- A marker MUST be materially smaller than the payload according to configured economics; otherwise the full payload SHOULD be emitted.
- Deduplication state SHOULD be stored outside lossy conversation summaries so the runtime can measure behavior, but external state MUST NOT override active-context visibility checks.
- The optimization MUST NOT remove context required for correctness solely to reduce tokens.
- Baseline token/context metrics MUST be captured before claiming improvement.
- The same representative workload MUST be measured after implementation.
- Quality/regression checks MUST accompany token/cost comparisons.
- False elision, stale reference, hidden error, or reduced fresh tool execution MUST block verification.
- Optimization retries MUST be bounded to two diagnose/change/measure cycles before reverting or escalating.
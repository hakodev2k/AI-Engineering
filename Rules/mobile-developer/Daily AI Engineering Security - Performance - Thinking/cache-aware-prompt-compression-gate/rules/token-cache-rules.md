# Rules — Token and Cache Preservation

- Prompts MUST classify every segment as `stable`, `dynamic`, or `protected` before optimization.
- `protected` segments MUST NOT be removed, summarized, or compressed by an automated optimization step.
- Stable reusable segments SHOULD appear before volatile request-specific segments when provider caching is prefix-sensitive.
- Optimizations MUST measure cached-token reuse rather than infer it from prompt similarity.
- Raw input-token reduction MUST NOT be used as the sole success metric.
- Baseline and candidate runs MUST use identical evaluation cases and materially equivalent provider/model settings.
- A candidate MUST be rejected when critical-context failures exceed policy.
- A candidate MUST be rejected when quality regression exceeds policy even if token cost improves.
- Cache-write cost, when exposed by the provider, MUST be included in effective-cost calculations.
- Unknown or missing usage fields MUST be reported as unknown; they MUST NOT be silently replaced with zero.
- Compression SHOULD avoid rewriting stable prefixes unless the candidate proves better cost/latency with no quality regression.
- Optimization loops MUST stop after the configured candidate limit.
- Final acceptance MUST include an independent rerun or verification pass.
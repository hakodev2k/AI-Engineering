# Rules: Cache Stability

- Prompt construction MUST expose ordered segment IDs and token estimates for cacheable prefixes.
- Volatile runtime metadata MUST NOT be placed inside a stable cacheable prefix unless correctness requires it.
- A prompt change MUST identify the first changed segment and estimated downstream blast-radius tokens before claiming cache impact.
- Required context MUST NOT be removed solely to reduce tokens.
- Cache optimization MUST be measured with actual cache-read/cache-creation metrics when the provider exposes them.
- Quality and correctness regression tests MUST pass after relocating or isolating context.
- Duplicate static instructions SHOULD be deduplicated before caching.
- Session IDs, timestamps, cwd values, hook outputs, and transient notification text SHOULD be classified `volatile` by default.
- Cache-churn budget exceptions MUST be explicit, justified, and measured.
- Optimization retries MUST be bounded to two experiments per identified volatility source.

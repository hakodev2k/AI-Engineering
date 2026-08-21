# Rules — Prompt Cache Stability

- Reusable prompt-prefix content MUST serialize deterministically across live requests, resume, and history rebuild.
- Stable hook context MUST use one canonical wrapper, UTF-8 encoding, normalized `\n` newlines, and deterministic object-key ordering.
- Timestamps, request IDs, random values, latency values, and other volatile fields MUST NOT be embedded in a block declared reusable.
- A token optimization MUST NOT remove task instructions, security policy, evidence, or state required for correctness.
- Cache regressions MUST be measured from provider usage fields or equivalent request-level telemetry; cost impressions alone are insufficient.
- A release MUST be blocked when an unchanged reusable prefix exceeds the configured rewrite-ratio threshold in the regression fixture.
- A suspected cache regression MUST be checked for TTL expiry, model changes, tool-schema changes, compaction, and intentional prompt edits before root cause is assigned.
- Cache savings MUST NOT be reported as verified until the same workload passes quality/regression checks.
- Optimization retries MUST be bounded to three diagnosis/repair cycles.
- Raw prompts containing secrets SHOULD NOT be persisted solely for cache analysis; hashes and structural metadata SHOULD be preferred.

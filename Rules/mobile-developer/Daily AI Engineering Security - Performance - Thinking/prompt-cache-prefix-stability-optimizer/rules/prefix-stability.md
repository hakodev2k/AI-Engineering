# Rules: Prompt Cache Prefix Stability

- Cache optimization MUST begin with a measured baseline, not an assumed cache hit.
- Comparable request cohorts MUST use the same workflow class and model configuration.
- Static instructions, invariant examples, and deterministic tool/schema definitions SHOULD precede volatile per-request data when provider semantics permit.
- Timestamps, request IDs, nonces, user-specific fields, and query-specific retrieved content SHOULD NOT appear before large reusable blocks unless correctness requires it.
- Expected-stable segments MUST use deterministic serialization and ordering.
- Tool definitions MUST NOT be reordered nondeterministically between equivalent requests.
- Provider `cached_tokens` or equivalent telemetry MUST be recorded when available.
- A cache key or routing hint MUST NOT be treated as proof that different prefixes are reusable.
- Prompt compression MUST be evaluated for its effect on cache reuse as well as raw token count.
- Required security, policy, user-intent, and correctness context MUST NOT be removed merely to improve cache ratio.
- Before/after comparison MUST include a task-quality or success signal.
- An optimization MUST be reverted when quality regression exceeds configured tolerance.
- Optimization loops MUST stop after three failed evidence-driven cycles.
- Privacy-sensitive prompt content MUST be redacted or hashed before profiling logs are persisted.
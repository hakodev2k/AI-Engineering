# Rules: Cache Affinity and Token Budget

- One logical agent conversation/run MUST use a stable `session_id` when OpenRouter sticky routing is expected to preserve a warm provider cache.
- A new `session_id` MUST NOT be generated per turn.
- Reusable prompt prefixes SHOULD remain byte/semantic-order stable where correctness permits; dynamic timestamps/run metadata SHOULD be placed after the stable prefix.
- Cache-capability decisions SHOULD use provider/model capability data rather than a stale hard-coded model-name allowlist when such metadata is available.
- Every cache optimization change MUST capture a baseline before modification and a comparable trace after modification.
- Teams MUST measure `cached_tokens` or equivalent provider telemetry; configuration presence alone MUST NOT be reported as a cache hit.
- Correctness-critical instructions, security policy, tool schemas, or evidence MUST NOT be removed merely to improve token metrics.
- Provider failover cold turns MUST be distinguished from persistent cache-affinity regressions.
- Secrets, authorization headers and raw sensitive prompt content MUST NOT be written to telemetry fixtures.
- Completion MUST be blocked when cache metrics improve only by reducing required context or degrading result quality.

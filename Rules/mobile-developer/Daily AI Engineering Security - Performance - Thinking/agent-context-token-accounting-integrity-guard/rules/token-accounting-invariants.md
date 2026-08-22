# Rules: Token Accounting Invariants

- `current_context_tokens` MUST represent the current prompt/input occupancy for one request or a documented estimate of that same quantity.
- `cumulative_usage_tokens` MUST be stored separately and MUST NOT drive automatic compaction by itself.
- Input, output, cache-read, and cache-write usage MUST remain separately identifiable when the provider exposes them.
- A context snapshot MUST include its measurement source and transcript/session revision identifier.
- A snapshot marked fresh MUST NOT be accepted if its semantic type is unknown.
- After compaction or transcript replacement, the prior occupancy snapshot MUST be invalidated and a new measurement or estimate MUST be produced before another automatic compaction decision.
- Automatic compaction MUST be blocked when occupancy exceeds the configured window but exact/current provider evidence does not support the value.
- Fallback estimates SHOULD expose a calibrated error ratio and MUST NOT be silently treated as exact provider usage.
- Repeated input tokens across multi-call tool loops MUST NOT be summed and reinterpreted as the next request's context occupancy.
- Cache-read usage MUST NOT be added to context occupancy unless the provider's documented usage semantics explicitly require that treatment.
- Threshold changes MUST NOT be used to mask an accounting-integrity failure.
- Context-loss operations MUST NOT proceed on an integrity-failed snapshot without explicit human recovery approval.
- Measurements and before/after compaction evidence SHOULD be retained without storing sensitive transcript content when hashes/byte counts are sufficient.

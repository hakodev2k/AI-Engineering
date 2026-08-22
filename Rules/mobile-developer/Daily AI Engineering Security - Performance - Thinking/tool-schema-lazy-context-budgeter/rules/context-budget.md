# Rules: Tool Schema Context Budget

- A baseline MUST be measured before enabling lazy schema loading.
- Tool-schema tokens/request MUST be tracked separately from system, history, user, and tool-result tokens when provider telemetry permits.
- The client MUST NOT remove a core/safety-critical tool solely to meet a token target.
- Tool selection MUST operate under an explicit full-schema token budget.
- Small toolsets SHOULD remain fully loaded when measured tiering overhead exceeds savings.
- Compact discovery descriptors MUST preserve tool identity and enough intent to support selection.
- Full JSON Schema MUST be loaded before invoking a selected tool.
- Registry changes MUST invalidate stale schema-cost measurements and selection caches.
- Recent use MAY boost selection but MUST NOT become permanent inclusion without evidence.
- Selection confidence failures SHOULD expand the candidate set or fall back safely rather than hallucinating parameters.
- Optimization MUST be rejected when selected-tool recall falls below the configured threshold.
- Optimization MUST be rejected when task-success regression exceeds the configured threshold.
- Before/after comparisons MUST use the same representative task set and model/provider settings where practical.
- Token savings MUST NOT be claimed from the deterministic estimator when authoritative provider token counts contradict it.
- Retry/tuning loops MUST be bounded to two iterations before fallback/review.
# Rules — Ephemeral Resource Intent
- A tool-free ephemeral task **MUST** have zero effective MCP servers.
- Session constructors **MUST NOT** infer tool requirements solely from global or parent MCP configuration.
- One-shot ephemeral completion **MUST** end owned runtime with remove/shutdown semantics, not unsubscribe-only semantics.
- Runtime disposal **MUST NOT** occur while tool calls are pending.
- A tool-enabled ephemeral task **SHOULD** load only the MCP servers required by its declared capability set.
- Optimizations **MUST** preserve required context and output correctness.
- Performance claims **MUST** include a before/after baseline for process count, RSS and latency.
- A regression gate **MUST** fail when tool-free summary quality falls below the configured equivalence threshold.
- Cleanup retries **MUST** be bounded; repeated failure **MUST** surface ownership telemetry rather than spawn more runtimes.

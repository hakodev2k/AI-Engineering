# Rules: Context and Compaction Budget

- A baseline trace MUST be captured before changing compaction or context-selection behavior.
- Repeated static context MUST be measured separately from dynamic task state.
- Correctness-critical requirements, security policy, unresolved evidence, and active checkpoint state MUST NOT be removed to satisfy a token budget.
- A second automatic compaction MUST NOT run unless the prior compaction produced measurable durable context reduction or a progress event.
- Compaction retries MUST be bounded by policy.
- Reported usage SHOULD be compared with an independent live-context estimate before it triggers destructive recovery behavior.
- Cache-read and cache-creation ratios MUST be recorded when the runtime exposes them.
- Tool schemas, agent registries, repository context, and other reloadable static payloads SHOULD be loaded on demand when evidence shows they dominate repeated context.
- An optimization MUST NOT be labeled improved unless before/after metrics show lower token use, lower compaction frequency, or lower latency with no critical quality regression.
- `stop-and-recover` MUST block further automatic compaction attempts until state transfer or human review resolves the condition.
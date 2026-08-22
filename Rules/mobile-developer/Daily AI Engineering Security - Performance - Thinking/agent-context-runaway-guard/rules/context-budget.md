# Context Budget Rules

- Every long-running agent **MUST** measure context utilization before optimizing or compacting.
- Compaction **MUST** target a materially lower utilization than its trigger threshold; trigger and target **MUST NOT** be identical.
- Post-compaction output **MUST** satisfy configured minimum headroom before the compaction is considered successful.
- Images, data URLs, tool outputs, retrieved documents, summaries, and conversation history **MUST** have explicit budgets or measured costs; they **MUST NOT** be treated as free because a text-token estimator ignores them.
- Required task facts, acceptance criteria, unresolved risks, approvals, and verification state **MUST NOT** be evicted solely to reduce tokens.
- Large deterministic artifacts **SHOULD** be referenced by stable identifiers or reloaded on demand instead of repeatedly embedded.
- Duplicate payloads **SHOULD** be deduplicated before compaction.
- Tool output **SHOULD** be truncated/filterable at source with the full artifact retained outside model context when required for audit.
- A second compaction within the configured short-turn window **MUST** trigger diagnosis of retained payloads before another automatic retry.
- Automatic compaction retries **MUST** be bounded to 2 attempts per incident; after that, stop and escalate or start a controlled fresh context with a verified handoff.
- Token reduction **MUST NOT** be declared successful without before/after metrics and a correctness/required-facts regression check.

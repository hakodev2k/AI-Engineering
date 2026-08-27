# Rules: Post-Compaction Token Budget

- Every compaction boundary MUST record the active model context window.
- Post-compaction context MUST be attributable to named sources.
- Mandatory system and task context MUST NOT be removed to save tokens.
- Unchanged static context SHOULD be deduplicated, cached, or lazily retrieved.
- Mixed-model subagents MUST use their own effective context-window budget.
- Any token optimization MUST include before/after measurements on the same workload.
- Completion MUST be blocked when configured refill limits fail.
- A lower token count MUST NOT be reported as an improvement if task-quality regression increases.
- Optimization loops MUST stop after two failed attempts.

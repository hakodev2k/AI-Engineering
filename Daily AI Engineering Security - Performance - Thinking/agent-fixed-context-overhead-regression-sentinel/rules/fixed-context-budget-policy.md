# Rules: Fixed Context Budget Policy

- Every production agent profile MUST have an approved fresh-session fixed-token baseline.
- Measurements MUST identify harness version, model/context tier, context limit, and enabled context components.
- Fixed overhead MUST be measured before meaningful user/task history is added.
- Component attribution MUST include system prompt, tools, rules, skills, MCP, subagent definitions, memory/attachments, and other when present.
- A candidate exceeding configured absolute, relative, or context-utilization thresholds MUST be blocked or explicitly approved with documented evidence.
- A harness that cannot fit its fixed overhead inside the target model context MUST NOT be deployed for that profile.
- Multi-agent planning MUST account for per-child fixed overhead; a smaller child model MUST NOT be assumed cheaper without measurement.
- Teams MUST NOT remove security, permission, provenance, or correctness-critical context merely to meet a token budget.
- Token-reduction changes MUST be followed by task-quality and safety regression verification.
- Token counts from incompatible tokenizers/providers SHOULD NOT be compared as exact equivalents without normalization or caveat.
- Large component regressions SHOULD be traced to a specific configuration or release delta before optimization.
- The baseline MUST be refreshed after changes to model, context tier, system prompt, tool set, skill set, MCP set, subagent definitions, or persistent memory injection.
- Completion MUST distinguish Implemented, Measured, and Verified status.
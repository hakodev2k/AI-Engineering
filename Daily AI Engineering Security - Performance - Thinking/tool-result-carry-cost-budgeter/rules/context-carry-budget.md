# Context Carry Budget Rules

- Teams **MUST** establish a trace baseline before changing tool-output/context behavior.
- Tool-result optimization **MUST** measure direct tokens and cumulative carry tokens across the whole task, not only a single request.
- A result retained across later model turns **MUST** be attributable to a stable result identifier in observability data.
- Large or high-carry results **SHOULD** return only task-relevant fields, slices, summaries or out-of-band references when correctness allows.
- Required evidence, authorization state, user constraints and safety-critical context **MUST NOT** be evicted merely to reduce tokens.
- Prompt caching **MUST NOT** be reported as context reduction; cache savings and context occupancy are separate metrics.
- Compaction **MUST NOT** be assumed effective without a post-compaction trace showing reduced carry cost and no quality regression.
- Optimization claims **MUST** include before/after tokens/task plus a task-quality or verification result.
- The workflow **MUST** stop after two unsuccessful optimization iterations and re-evaluate the hypothesis instead of repeatedly deleting context.
- A budget failure **MUST NOT** be hidden by raising thresholds without evidence and owner approval.
- Implementers **SHOULD** prioritize the highest carry-cost contributors rather than applying uniform truncation to every tool.
- Security boundaries and required context **MUST** take precedence over token savings.
# Context Budget Rules

- The complete summarization envelope **MUST** fit within the model context limit before invocation.
- Budget calculation **MUST** reserve summary prompt tokens, output tokens, and a safety margin.
- Non-essential metadata **SHOULD** be stripped before conversational content is removed.
- Required message IDs **MUST NOT** be evicted to save tokens.
- Tool-call and tool-result pairs **MUST** remain structurally valid when trimming.
- A summarization overflow **MUST NOT** retry the identical oversized payload.
- Trimming retries **MUST** be bounded by `max_trim_attempts`.
- Token savings **MUST** be measured together with required-context retention and task-quality regression.
- Approximate token counting **MUST** include serialized structured metadata or apply a conservative margin.
- The guard **MUST** block rather than silently discard required correctness or security context.
- Summaries **SHOULD** preserve facts, decisions, unresolved risks, artifact references, and verification state.

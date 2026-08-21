# Tool-Sequence Atomicity Rules

- Context trimming **MUST** treat an assistant tool-call message plus all corresponding tool results as one atomic unit.
- A pruning operation **MUST NOT** emit an orphan `tool` message.
- A pruning operation **MUST NOT** create an unanswered assistant tool call by removing only its result.
- Input history **MUST** be validated before pruning and output history **MUST** be validated again before model invocation.
- Invalid history **MUST NOT** be silently repaired by inventing tool outputs unless an explicitly reviewed provider-specific recovery policy authorizes that behavior.
- Token savings **MUST NOT** override protocol correctness, current user intent, required system constraints, or active acceptance criteria.
- Protected context that prevents meeting the token budget **MUST** produce an explicit budget failure rather than unsafe deletion.
- Context-budget configuration **MUST** reserve expected output/reasoning capacity separately from input capacity.
- Trimming **SHOULD** operate on oldest complete units first and preserve a configurable number of recent units.
- Summarization **MUST** consume and replace complete atomic units; it **MUST NOT** summarize only one side of a tool transaction.
- Save/load, resume, compaction, and pre-model paths **SHOULD** share the same integrity validator.
- Metrics **MUST** include before/after token estimate, units dropped, integrity findings, and provider-schema error rate.
- A quality regression gate **SHOULD** compare representative task outcomes before accepting a more aggressive budget.
- Retry loops caused by invalid context **MUST** be bounded; the same malformed history **MUST NOT** be resubmitted unchanged.

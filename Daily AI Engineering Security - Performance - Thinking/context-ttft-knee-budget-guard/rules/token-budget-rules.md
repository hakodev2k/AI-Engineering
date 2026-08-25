# Token Budget Rules

- Context-window capacity MUST NOT be treated as a latency SLA.
- Calibration telemetry MUST separate model TTFT from tool execution and approval wait.
- Budgets MUST be scoped by model and workload when their latency curves differ.
- A latency knee MUST have at least the configured minimum samples before enforcement.
- Required safety, authorization, acceptance criteria, and task evidence MUST NOT be evicted merely to reduce tokens.
- Cached tokens MUST be measured separately from total input tokens.
- Any compression/retrieval change MUST include a task-quality regression check.
- A budget breach SHOULD trigger compaction/retrieval/thread handoff before the next expensive request when safe.
- Human/application policy MAY override a soft budget when correctness requires more context; the exception MUST be logged.
- Budget-tuning loops MUST be bounded to two iterations per calibration cycle.
- Improvement MUST NOT be claimed without before/after TTFT and quality evidence.

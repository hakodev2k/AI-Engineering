# Subagent Orchestration Budget Rules

- Coordinator status intents MUST use the authoritative subagent-status tool family configured for the runtime.
- A semantically adjacent wait/shell/exec tool MUST NOT be treated as equivalent to `wait_agent` or `list_agents`.
- Every orchestration-only turn MUST increment a turn counter and estimated token counter.
- No-progress cycles MUST be bounded.
- Poll intervals SHOULD back off while no progress is observed and MAY reset after a real progress event.
- A terminal lifecycle event MUST take precedence over stale cached `running` state.
- Missing terminal events MUST trigger one authoritative reconciliation before additional polling.
- The coordinator MUST stop or escalate when orchestration budgets are exhausted.
- Budget exhaustion MUST NOT be hidden by resetting counters or widening limits automatically.
- Result collection MUST be verified before declaring a child complete.
- Performance improvements MUST be measured against a baseline and MUST NOT discard child results for lower token cost.
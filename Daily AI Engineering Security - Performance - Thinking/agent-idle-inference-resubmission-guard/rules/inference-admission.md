# Inference Admission Rules

- Every background/internal model request MUST have at least one fresh progress-bearing trigger.
- A timer tick by itself MUST NOT authorize a model request.
- `needs_follow_up=false` AND `has_pending_input=false` AND `state_changed=false` MUST block inference unless a bounded retry has a demonstrably changed reason/state.
- Terminal workers MUST NOT issue new inference without a new external event that reopens the task.
- Trigger IDs or state versions MUST be deduplicated so the same event cannot authorize unlimited requests.
- Retry loops MUST have a maximum attempt count and MUST stop when the failure cause and relevant state are unchanged.
- Cached input tokens MUST be included in runaway accounting and alerts.
- The system SHOULD reach quiescence within one scheduler cycle after all work becomes terminal.
- The guard MUST preserve legitimate continuations caused by new user input, fresh tool results, new approval decisions, or changed external state.
- Token reduction MUST NOT be achieved by dropping context required for correctness.
- Ambiguous state MUST surface as a diagnostic block rather than silently discarding work.
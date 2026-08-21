# Wait Loop Rules

## Performance invariants
- Long-running process waiting **MUST** establish a baseline for poll count, wait-only model turns, estimated wait tokens, completion-detection delay, and task latency before claiming improvement.
- Runtime/event notification **SHOULD** be preferred over model-mediated polling when an authoritative completion/output event exists.
- The model **MUST NOT** be used merely as a timer when deterministic runtime waiting can perform the same function.
- Polling fallback **MUST** have a maximum poll count, maximum no-progress count, and maximum wait-token budget.
- Poll intervals **SHOULD** back off after no-progress results and reset only when meaningful progress is observed.
- Identical no-progress status responses **MUST NOT** trigger unbounded full-context model turns.
- A command that completes **MUST** be collected exactly once; stale polling handles **MUST NOT** remain active after terminal state.
- When the user-facing deliverable is already complete, background cleanup monitoring **MUST** use the stricter `post_deliverable_max_polls` budget.
- Budget exhaustion **MUST** produce an explicit stop/reconcile/escalate decision rather than silently continuing.
- Destructive cancellation **MUST NOT** occur automatically when policy requires human approval.
- Optimization **MUST NOT** hide process errors, discard required output, or mark a still-running command successful.
- Improvements **MUST** be measured against the same representative command-duration classes and context sizes.

## Verification invariants
- A fast command completes without unnecessary polling.
- A silent healthy long command does not trigger a tight model loop.
- A command that emits progress resets no-progress backoff correctly.
- A hung command reaches a bounded escalation state.
- A terminal event prevents subsequent wait polls.
- Token savings are reported with completion-detection delay so cost is not reduced by unacceptable latency.

# Progress Budget Rules

- A tool call MUST NOT be treated as progress solely because it returned success.
- Every discovery workflow MUST define finite maximum search-call and consecutive zero-progress budgets before execution.
- Repeated normalized query/result fingerprints beyond threshold MUST block another identical discovery call.
- A discovery call SHOULD reset stagnation only when it adds a relevant capability, new evidence, or completes a checkpoint.
- The runtime MUST track elapsed time and total tool-call count in addition to model-visible retry messages.
- Natural-language warnings MUST NOT be the only loop-control mechanism.
- When blocked, the agent MUST choose one bounded alternative strategy or return an explicit capability-unavailable result.
- Alternative-strategy retries MUST be bounded to at most 2 by default.
- The guard MUST NOT remove security approvals, permission checks, or correctness-critical context to improve performance.
- Performance claims MUST include a comparable baseline and before/after measurements.
- Completion MUST NOT be reported when execution merely stopped due to budget; verification MUST confirm task completion or explicit failure semantics.
- Persisted loop evidence MUST NOT contain plaintext credentials or secrets.

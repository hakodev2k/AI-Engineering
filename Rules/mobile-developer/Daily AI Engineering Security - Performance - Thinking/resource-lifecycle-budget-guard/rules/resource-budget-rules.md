# Resource Budget Rules

- Every spawned task-scoped process, browser page, MCP client, and helper MUST have an owner ID and lease expiry.
- The system MUST capture a resource baseline before performance optimization and MUST measure again afterward.
- Task completion, cancellation, and timeout MUST NOT be considered complete until cleanup postconditions are checked.
- The system MUST NOT terminate a resource solely because its executable name resembles an agent helper; ownership MUST be proven.
- Per-task and global soft/hard budgets MUST be explicit for process count, memory, browser pages, and helper/client count.
- Crossing a soft budget SHOULD stop new resource creation and trigger diagnosis.
- Crossing a hard budget MUST block new task work and trigger bounded cleanup.
- Retry/reconnect paths MUST retire or transfer the previous lease before creating an equivalent replacement.
- Long-lived pools MUST demonstrate a stable plateau under repeated bounded workloads.
- Cleanup MUST attempt graceful shutdown before force termination.
- Force termination of owned resources MAY occur only after graceful timeout and MUST be logged with ownership evidence.
- Resource cleanup MUST NOT weaken sandboxing, authentication, or other security boundaries.
- Performance claims MUST include before/after measurements and workload identity.
- Cleanup retries MUST be bounded to two cycles.
- If ownership is ambiguous, automatic destructive cleanup MUST stop and escalate.
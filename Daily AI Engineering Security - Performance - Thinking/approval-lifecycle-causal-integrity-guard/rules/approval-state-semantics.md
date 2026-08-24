# Approval State Semantics Rules

1. Every approval-gated tool invocation MUST have an immutable `call_id`.
2. The runtime MUST represent `requested`, `awaiting_approval`, `approved`, `executing`, `completed`, `rejected`, `interrupted`, and `failed` as distinct states when applicable.
3. `rejected`, `completed`, and `failed` MUST be terminal for a call ID. A new attempt MUST receive a new call ID.
4. A rejected call MUST NOT transition to `approved`, `executing`, or `completed`.
5. Human approval wait MUST NOT be counted as tool execution duration.
6. Performance conclusions MUST use execution-only timing. End-to-end wall time MAY be reported separately but MUST be labeled as such.
7. An interrupt/pause MUST NOT be normalized to a generic tool failure unless the runtime has independently established a real failure.
8. Broad exception handlers MUST preserve framework-specific interrupt/control-flow exceptions.
9. Retry logic MUST NOT retry a rejected call. A changed proposal requires a new call and a new approval decision.
10. Agent-generated causal explanations MUST NOT cite ambiguous elapsed time as evidence.
11. Audit failure MUST block performance-driven implementation changes based on the affected call.
12. Approval telemetry SHOULD record monotonic timestamps for request, wait start, decision, execution start, execution end, and result delivery.

# Tool Execution Integrity Rules

1. Streamed tool calls MUST remain non-executable until a provider terminal event or equivalent completion signal has been observed.
2. Partial and complete tool calls MUST use distinguishable runtime states.
3. A tool call MUST have a non-empty stable call ID and tool name before execution.
4. Arguments MUST be parsed from the fully assembled payload and MUST pass the tool's current schema before execution.
5. Malformed or truncated arguments MUST NOT be replaced by `{}`, nulls, guessed defaults, or previously cached arguments merely to keep the agent loop running.
6. Authorization MUST be evaluated against the finalized tool name and finalized arguments, not an earlier partial preview.
7. Side-effecting calls MUST have an idempotency key or equivalent deduplication identity before execution.
8. The runtime MUST record an integrity hash of finalized tool identity and arguments before execution.
9. If transport/process failure occurs after execution may have started but before a result is durably recorded, the outcome MUST be marked `unknown`.
10. An `unknown` side-effect outcome MUST be reconciled against external/postcondition state before retry.
11. A side-effecting call MUST NOT be blindly retried solely because the model did not receive a tool result.
12. Session resume MUST identify orphaned tool calls and MUST NOT fabricate successful tool results to repair message ordering.
13. Repair retries MUST be bounded by `max_repair_attempts`; after the bound, the system MUST stop or require human review.
14. High-impact actions SHOULD use deterministic postcondition checks, such as file hash/existence, resource version, transaction ID, or API idempotency receipt.
15. The agent that performs a high-risk implementation MUST NOT be the only verifier of tool-call integrity tests.
16. Logs MUST preserve lifecycle reason codes while redacting secrets and sensitive argument values.

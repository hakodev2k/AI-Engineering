# Failover Continuity Rules

- Every agent run MUST have one shared retry budget across SDK, gateway, provider adapter and orchestration layers.
- Provider-specific response IDs, conversation IDs, tool-call IDs, cache handles and credential state MUST NOT be copied into another provider's request.
- A failover MUST begin from a durable provider-neutral checkpoint or stop cleanly.
- Side-effecting tools MUST NOT be replayed until their prior execution status is reconciled.
- Tool invocations SHOULD carry an idempotency key that survives provider failover.
- A provider failure MUST be classified as transient, quota/auth, semantic/request, state-corruption, or unknown before selecting retry/failover.
- Auth and quota errors from a fallback provider MUST NOT poison the primary provider's credential or health state.
- A fallback provider MUST pass tool-schema and required-feature compatibility checks before use.
- Ambiguous partial streamed tool calls MUST NOT be executed or replayed automatically.
- The agent MUST surface a terminal or recoverable status before the configured stall deadline; silent indefinite waiting is forbidden.
- Retries MUST use bounded exponential backoff with jitter and a maximum attempt count.
- Provider switching MUST preserve user approvals and MUST NOT broaden permissions, network access, tool availability or data disclosure.
- A fallback that lowers required correctness or security guarantees MUST require explicit human approval.
- Completion MUST be verified from end-to-end task state, not merely from a successful fallback API response.

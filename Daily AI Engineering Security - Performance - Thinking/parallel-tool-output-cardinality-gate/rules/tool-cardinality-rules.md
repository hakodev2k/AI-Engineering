# Rules — Parallel Tool Output Cardinality

1. Every model turn containing tool calls MUST create a turn ledger containing every emitted call ID before dispatch begins.
2. Call IDs MUST be unique within a turn.
3. Every non-deferred call MUST reach exactly one terminal disposition before the next model request: `success`, `error`, `rejected`, or `cancelled`.
4. `interrupted` MAY be non-terminal only when the framework persists enough state to resume the same call identity safely.
5. A rejected or cancelled call MUST NOT be encoded as a successful execution.
6. Generated, persisted, and provider-sent output states MUST be tracked separately.
7. Persistence MUST NOT imply that an output was already sent to or acknowledged by the provider.
8. Resume hydration MUST reconcile expected call IDs against terminal records and provider conversation state.
9. The next model request MUST be blocked when any required call ID is missing a terminal output/disposition.
10. Duplicate terminal records for the same call ID MUST block continuation until resolved.
11. Repair MAY run once using authoritative persisted state; retry loops MUST NOT exceed one reconciliation attempt for the same turn.
12. The system MUST NOT fabricate a missing output merely to satisfy provider protocol requirements.
13. Parallel execution SHOULD remain enabled when the ledger proves completeness; serial execution MUST NOT be used as the default substitute for fixing accounting defects.
14. Benchmarking MUST measure verification overhead and parallel throughput before claiming the gate is production-ready.
15. Logs SHOULD include IDs and state transitions but MUST NOT expose secrets or sensitive tool payloads unnecessarily.

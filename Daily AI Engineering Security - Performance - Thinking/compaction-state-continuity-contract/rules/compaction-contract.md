# Rules: Compaction Continuity Contract

- Every replacement context MUST receive a new context epoch identifier.
- Durable active context MUST be re-rendered into each new epoch even when unchanged since an earlier turn.
- Turn-level deduplication MUST NOT suppress durable values solely because they were emitted in a previous epoch.
- Correctness-critical security, authorization, approval, and task constraints MUST NOT be removed merely to meet a token budget.
- Checkpoints MUST include active goal, constraints, decisions, failed/rejected approaches, next action, active-context keys, epoch ID, and verification status.
- Recent tool calls and their results MUST remain paired when retained verbatim.
- The raw operational tail SHOULD be bounded and composed of complete operation groups.
- Large static registries or instruction sets SHOULD NOT be blindly re-injected in full when lower-priority portions can be retrieved on demand.
- Checkpoint, rehydration, raw-tail, and total post-compaction token budgets MUST be measured before continuation.
- A budget violation MUST NOT be hidden by dropping critical context.
- A continuity validation failure MUST block the next model/tool step until rebuilt or safely fallen back.
- Rebuild attempts MUST be bounded.
- Continuation quality MUST be measured alongside token reduction; lower tokens alone MUST NOT be reported as a verified improvement.
- The verifier MUST distinguish `Implemented`, `Measured`, and `Verified` states.

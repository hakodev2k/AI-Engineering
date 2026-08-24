# Plan-Approval Continuity Rules

- Explicit human approval MUST be persisted as a structured receipt before execution begins.
- A runtime MUST NOT infer approval from conversation history, model memory, system reminders, timeout/default behavior, or tool error text.
- Approval MUST be revalidated after worker restart, session resume, context compaction, plan-mode transition, workspace revision change, and execution-phase transition.
- The current plan SHA-256 and task ID MUST exactly match the receipt.
- Workspace revision MUST match when policy requires it.
- The intended execution phase MUST be within the receipt's allowed phases when policy requires it.
- Expired or future-dated receipts MUST block execution.
- A runtime MUST NOT automatically mint, extend, upgrade, or reinterpret a human approval receipt.
- An exact still-valid receipt SHOULD be treated idempotently so the runtime does not repeatedly ask for the same approval after restart.
- Recovery loops MUST be bounded to at most two attempts before human escalation.
- Dangerous or irreversible operations MUST preserve any stricter platform-specific human approval requirements.
- The implementing agent MUST NOT be the only verifier of approval-continuity changes.
- Persisted state SHOULD contain only the minimum decision facts needed for verification, not hidden reasoning traces.
# Cost Governance Rules

## MUST
- Every metered workflow MUST have a validated budget plan before execution.
- Every metered operation MUST write an actual-cost ledger entry, including failed attempts that incur cost.
- Verification budget MUST be reserved before execution begins.
- Retry counts MUST be bounded by policy and tracked per operation.
- Unknown-cost paid operations MUST be treated as non-admissible unless policy explicitly permits them.
- A workflow MUST stop when a hard task or stage limit is exceeded.
- A workflow MUST stop before consuming protected verification reserve for non-verification work.
- Soft-limit crossings and configured expensive escalations MUST return `human-approval-required`.
- Human approval MUST identify the task, approved new ceiling, approver, timestamp, and reason.
- Final reporting MUST distinguish `executed` from `verified`.
- Cost estimates MUST state whether they are configured estimates or observed actuals.

## MUST NOT
- Do not silently increase a budget.
- Do not retry until success.
- Do not omit failed billable calls from the ledger.
- Do not assume unknown cost is zero.
- Do not move verification work into execution stages merely to bypass reserve protection.
- Do not spawn extra agents or switch to a more expensive model/tool after a gate blocks the action.
- Do not fabricate vendor prices or token rates.
- Do not continue after ledger integrity errors until the ledger is repaired and revalidated.
- Do not treat a provider/tool success response as proof that the task is verified.

## SHOULD
- Prefer cheaper deterministic tools for deterministic checks.
- Prefer staged context acquisition over loading an entire repository.
- Batch compatible read-only operations when this reduces cost without reducing evidence quality.
- Use low-cost models for classification/extraction and escalate only when the task requires it.
- Record useful unit metadata such as tokens, requests, seconds, pages, or tool invocations when available.
- Preserve reconciliation reports for later optimization and audit.
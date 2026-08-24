# Background Budget Rules

1. Every background AI job **MUST** have a stable `job_id` and `parent_id` before its first model request.
2. Every model request **MUST** be attributable to exactly one foreground or background execution class.
3. Background jobs **MUST** declare request, token, and wall-time budgets before dispatch.
4. Hosts **MUST** account for input, output, and cached-input tokens separately when available.
5. A successful model response **MUST NOT** count as progress unless a progress fingerprint changes or a declared artifact/state transition occurs.
6. A background job **MUST NOT** submit another model request when there is no new external input, no pending work item, and the prior progress fingerprint is unchanged.
7. Identical `state_fingerprint` values across consecutive model requests **MUST** increment a no-progress counter.
8. A job **MUST** stop or require explicit operator escalation when any hard budget is reached.
9. A job **MUST** stop automatically after 3 consecutive no-progress model turns unless the host records a new external event that changes its state fingerprint.
10. Parent completion **MUST** trigger reconciliation of all live child jobs; detached jobs require an explicit durable owner.
11. Unattributed model requests **MUST** be treated as an accounting failure and **MUST** block a Verified status.
12. Hosts **SHOULD** expose background usage separately from foreground usage.
13. Budget controls **MUST NOT** drop correctness-critical context merely to reduce token use; the safe fallback is to pause/escalate the job.
14. Retrying after rate limits or transient errors **MUST** use bounded retries and **MUST** still count against request/wall-time budgets.
15. Verification **MUST** compare useful output and task quality before and after budget controls; lower spend alone is insufficient.

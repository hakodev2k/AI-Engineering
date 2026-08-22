# Engineering Rules

## MUST

- Every material obligation MUST have a stable task ID before implementation begins.
- The approved baseline MUST be sealed with a deterministic content hash and retained unchanged for the run.
- Progress state MUST be derived from append-only events, not from a freely editable summary field.
- Event sequence numbers MUST be monotonic and gap-free.
- Every state transition MUST identify task ID, prior state, next state, actor, and timestamp.
- `completed` MUST include policy-accepted evidence references when the policy requires evidence.
- Mandatory work removed from scope MUST transition to `cancelled`; it MUST NOT disappear.
- Mandatory cancellation MUST include an explicit human approval/reference when configured.
- Unknown task IDs, duplicate baseline IDs, illegal transitions, sequence gaps, or baseline hash drift MUST block completion.
- Before any final “done” signal, the deterministic completion gate MUST run against the original baseline and full event history.
- Pending, in-progress, or blocked mandatory tasks MUST remain visible in final output and MUST block semantic completion unless the run is explicitly reported incomplete.
- High-risk runs MUST use an independent final verifier when policy enables that requirement.
- Any suspected ledger corruption MUST preserve the original evidence before repair.
- Retries MUST be bounded by `max_reconciliation_retries`.

## MUST NOT

- An agent MUST NOT delete an unfinished task to improve apparent completion percentage.
- A task ID MUST NOT be reused for a different obligation.
- A task MUST NOT jump directly to `completed` through a transition that policy forbids.
- Prior valid events MUST NOT be edited, reordered, or removed to repair later mistakes.
- Mandatory status MUST NOT be downgraded merely to make completion pass.
- Acceptance criteria MUST NOT be weakened after failed verification without explicit approved scope change.
- A final summary MUST NOT be treated as the source of truth for progress.
- A reviewer MUST NOT trust only the current mutable todo view when the sealed baseline/event history is available.
- The implementation agent MUST NOT be the sole verifier for high-risk changes.
- A policy failure MUST NOT be hidden by resetting the ledger or starting a new task ID for the same obligation.
- Human approval references MUST NOT contain secrets; store opaque IDs, links, or audit references only.

## SHOULD

- Store the baseline and ledger outside the implementation agent's unrestricted write scope when the host supports it.
- Prefer host-generated event sequence numbers and timestamps over model-generated values.
- Bind the sealed baseline to run ID, issue/plan reference, and policy version.
- Keep task titles concise and place detailed proof in evidence references rather than bloating ledger events.
- Review false blocks separately from policy violations; tune classification carefully without weakening core integrity invariants.
- Compare the ledger with repository diff, CI/test results, and approved requirements during final reconciliation.
- Treat renaming as metadata attached to the same task identity rather than creating/deleting tasks.
- Model legitimate plan evolution as explicit amendments or parent/child relationships rather than silent baseline edits.
- Alert when the same actor generates repeated illegal transitions or cancellation attempts.
- Preserve negative evidence such as failed tests, blocked tasks, and rejected transitions for postmortem analysis.
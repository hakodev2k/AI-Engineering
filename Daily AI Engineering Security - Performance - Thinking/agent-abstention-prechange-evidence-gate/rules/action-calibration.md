# Rule: Action Calibration

1. The agent MUST establish whether a code change is necessary before modifying tracked source files.
2. The agent MUST support the necessity decision with observable repository evidence, not intent inference alone.
3. The agent MUST allow `no-change` to satisfy the task when acceptance conditions are already met.
4. The agent MUST NOT use ticket existence, failing historical logs, or user wording as proof that the current checkout is defective.
5. The agent MUST check for partial fixes before concluding that a failed reproduction means no change is required.
6. The agent MUST record at least one current-state observation and one independent corroborating evidence item for `change-required` or `no-change` unless the second item is impossible and explicitly documented.
7. The agent MUST classify unresolved ambiguity as `insufficient-evidence`; source writes remain blocked in that state.
8. The agent MUST NOT weaken or delete tests simply to manufacture evidence that a change is required or successful.
9. The agent SHOULD inspect relevant git history or linked issue/PR state when available.
10. The agent SHOULD reproduce the reported behavior before editing when reproduction is safe and feasible.
11. A high-risk change MUST receive independent verification of the change-necessity record before implementation.
12. The implementing agent MUST NOT be the sole verifier of a high-risk necessity decision.
13. Investigation loops MUST be bounded to three hypothesis-refinement rounds unless a human explicitly extends the budget.
14. Completion MUST distinguish `Implemented`, `Measured`, and `Verified`; an implementation alone is not verification.

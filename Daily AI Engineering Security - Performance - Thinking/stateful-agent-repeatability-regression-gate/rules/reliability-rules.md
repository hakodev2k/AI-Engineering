# Stateful Agent Reliability Rules

1. Consequential workflows **MUST** be evaluated against executable terminal-state assertions, not final text alone.
2. A release claim **MUST** include repeated clean-state trials for each critical task.
3. Failed trials **MUST NOT** be discarded, hidden, or replaced by successful retries.
4. Harness/provider failures **MUST** be reported separately from agent task failures and **MUST NOT** count as success.
5. A task that passes some but not all trials **MUST** be classified as flaky for the measured trial count.
6. Aggregate pass rate **MUST NOT** be the sole release metric; task-level all-runs success and flaky-task rate **MUST** also be reported.
7. Forbidden collateral effects **MUST** be asserted explicitly and **MUST** block release when configured as critical.
8. Baseline and candidate **MUST** use the same task inputs, reset state, trial count, and scoring assertions for a regression comparison.
9. Thresholds **MUST NOT** be relaxed after observing candidate results without a documented policy change and independent approval.
10. Retry/recovery loops **MUST** be bounded and **MUST NOT** be increased solely to manufacture a passing aggregate.
11. Conclusions **MUST** cite observable evidence: task input, tool outcome, state assertion, trace/event ID, or test result.
12. Hidden chain-of-thought **MUST NOT** be requested or used as verification evidence.
13. An implementer **MUST NOT** be the only verifier for a high-impact reliability change.
14. Unreliable reset or missing state assertions **MUST** block the gate rather than produce an optimistic score.
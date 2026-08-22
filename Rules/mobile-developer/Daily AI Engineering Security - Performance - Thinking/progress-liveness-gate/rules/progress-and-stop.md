# Rules: Progress and Stop Conditions

- Every autonomous iteration MUST reference the same explicit active goal and current unsatisfied acceptance criteria.
- An iteration MUST NOT be counted as progress unless it produces a new goal-relevant observable state delta.
- Status text, repeated plans, repeated reviews, unchanged reports, duplicate evidence, and orchestration churn MUST NOT reset a no-progress streak.
- Progress SHOULD be measured using changed deliverable files, newly passing required tests, newly satisfied acceptance criteria, newly verified evidence, or a reduced blocker set.
- After two consecutive zero-progress iterations, the agent MUST either change the hypothesis/approach or identify an explicit blocker.
- After three consecutive zero-progress iterations, autonomous continuation MUST stop and escalate with evidence.
- A failed hypothesis MUST NOT be retried unchanged unless new evidence materially changes its likelihood.
- User corrections that invalidate an assumption MUST invalidate downstream decisions depending on that assumption.
- The agent MUST NOT claim completion while any required acceptance criterion is false or unverified.
- Supporting artifacts MUST NOT substitute for the requested deliverable unless the user explicitly changed the goal.
- Token/time cost SHOULD be recorded per newly satisfied acceptance criterion for long-running tasks.
- Retry and continuation loops MUST be bounded and MUST preserve the latest verified state.
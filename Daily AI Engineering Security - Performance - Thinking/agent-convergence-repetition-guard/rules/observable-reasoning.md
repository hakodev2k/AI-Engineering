# Rules: Observable Convergence

- Agent progress MUST be evaluated from observable task state, tool/action metadata, tests, artifacts, or acceptance criteria.
- The system MUST NOT request, store, or expose hidden chain-of-thought for convergence control.
- Identical tool name + normalized arguments MUST be fingerprintable when loop control is enabled.
- A warning threshold MUST require a changed hypothesis, changed input, changed action, or explicit completion decision.
- A stopped repetition MUST NOT be retried with byte-identical inputs unless new external evidence changed the expected result.
- Recovery loops MUST have a configured maximum cycle count.
- Fixed step/time budgets SHOULD remain as outer safety bounds, not the sole definition of progress.
- Productive long-running work MUST NOT be stopped solely because elapsed time is high when measurable progress continues within resource budgets.
- Scope growth MUST be accompanied by explicit justification and measurable closure of prior acceptance items.
- High-risk or irreversible recovery actions MUST require explicit human approval.
- Completion MUST be backed by verification evidence; otherwise the outcome MUST be clarification or escalation.

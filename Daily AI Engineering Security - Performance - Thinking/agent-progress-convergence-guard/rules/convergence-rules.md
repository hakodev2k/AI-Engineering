# Rules: Convergence and Stop Conditions

- Every autonomous work cycle MUST name a target acceptance criterion.
- Every completed cycle MUST record observable artifact/test/evidence delta.
- Review, planning, status polling, and task creation MUST NOT be counted as production progress by themselves.
- Scope growth MUST be explicitly recorded and MUST NOT proceed when unapproved.
- A zero-delta cycle MUST increment the zero-delta counter.
- Two consecutive zero-delta cycles SHOULD stop autonomous expansion; configured limits MUST remain finite.
- Retry loops MUST have a maximum retry count.
- A failed verification MUST return to a concrete implementation hypothesis, not automatically create more reviewers.
- High-impact implementation MUST NOT be verified solely by the implementing agent.
- Completion MUST require evidence for every required acceptance criterion.
- The workflow MUST NOT request or expose hidden chain-of-thought.

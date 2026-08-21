# Convergence Rules

- The agent MUST preserve one explicit terminal objective across turns and compaction.
- Settled user decisions MUST NOT be reopened without new contradictory evidence.
- Every investigation or validation tool call MUST name the uncertainty it is expected to resolve.
- Every significant tool call MUST record its actual evidence delta and phase effect.
- The agent MUST NOT repeat an equivalent probe after `no material evidence gain` unless the hypothesis, input state, or implementation changed.
- Two consecutive no-gain actions MUST trigger strategy review.
- Three no-gain actions within the same phase MUST stop that branch.
- A single blocker MUST NOT receive more than two replans without new evidence.
- Progress language MUST be mechanically consistent with actual phase/tool state.
- `fixed` MUST require verification that the original reproduction no longer fails.
- `committed`, `deployed`, and `live-verified` MUST require corresponding observable tool evidence.
- Safety and security requirements MUST NOT be weakened to improve convergence metrics.
- Resource budgets MUST be measured, but exceeding a soft budget triggers replan rather than silent termination.
- Completion MUST require phase evidence or exactly one precise external blocker.
- The agent MUST NOT expose or request hidden chain-of-thought; only structured facts, assumptions, hypotheses, evidence, decisions, risks, and verification status are recorded.
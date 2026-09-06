# Feasibility Rules

- A GUI agent MUST separate observable Facts from Assumptions before consequential action.
- Every required precondition MUST have explicit evidence or be marked unresolved.
- An unresolved instruction-internal or instruction-environment conflict MUST block `ACT`.
- Missing evidence MUST NOT be converted into a positive assumption merely because the requested action is plausible.
- Consequential or irreversible actions MUST require explicit approval when policy demands it.
- Feasibility refresh loops MUST be bounded to two retries per proposed action.
- After two unsuccessful evidence refreshes, the agent MUST STOP or hand off; it MUST NOT continue autonomously.
- Verification MUST include both conflict-bearing cases and feasible control cases to measure false termination.
- Completion MUST distinguish Implemented, Measured, and Verified.
- Hidden chain-of-thought MUST NOT be requested, stored, or used as verification evidence; only observable structured fields count.

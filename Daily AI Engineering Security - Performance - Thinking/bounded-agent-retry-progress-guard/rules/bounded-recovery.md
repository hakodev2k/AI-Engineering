# Rules: Bounded Recovery

- Every autonomous retry loop MUST have a finite attempt budget.
- Backoff MUST NOT substitute for a maximum retry count.
- Every long-running workflow MUST define observable progress criteria before execution.
- The agent MUST NOT count narrative self-assessment as progress.
- Repeated actions MUST use normalized signatures so cosmetic argument changes do not evade loop detection.
- Compaction/recovery operations MUST consume the same run-level no-progress budget as ordinary tool/model steps.
- Budget exhaustion MUST transition to a terminal `halt_and_escalate` state.
- A halted run MUST NOT autonomously restart the same action sequence.
- Recovery SHOULD resume from the last verified checkpoint, not from an unverified partial state.
- Dangerous or irreversible actions MUST trigger stricter limits and human approval.
- Verification MUST distinguish Implemented, Measured, and Verified status.

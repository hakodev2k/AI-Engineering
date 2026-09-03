# Rules: Plan Mode Authorization

1. A planning session MUST remain non-mutating until an explicit accepted approval is recorded.
2. Approval MUST bind the current `session_epoch`, `plan_hash`, and a unique `approval_id`.
3. A resume, reconnect, process relaunch, system notice, tool error, or permission-mode reconstruction MUST NOT be treated as user approval.
4. If a session resumes without valid bound approval, the host MUST restore or enforce planning/read-only behavior before any model-driven mutation.
5. Every write, edit, delete, commit, push, deploy, or equivalent side effect MUST pass an action-time approval check.
6. Changing the proposed plan after approval MUST invalidate that approval and require a new one before mutation.
7. Missing, corrupt, ambiguous, or contradictory approval state MUST fail closed.
8. A model instruction such as “continue implementation” MUST NOT override missing approval evidence.
9. Protected-path controls SHOULD remain enabled but MUST NOT be considered a substitute for plan approval.
10. Authorization logs SHOULD record decision, reason, plan hash, session epoch, approval ID, and attempted action without storing secrets.
11. The agent that performs a high-impact mutation MUST NOT be the only verifier of the approval boundary.
12. Human approval MUST be obtained through the host's intended approval mechanism before dangerous or irreversible actions.

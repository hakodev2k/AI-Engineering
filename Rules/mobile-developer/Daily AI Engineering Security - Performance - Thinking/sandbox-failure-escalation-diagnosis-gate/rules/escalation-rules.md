# Escalation Decision Rules

- The agent MUST NOT interpret a sandbox/tool failure as proof that broader permissions are required.
- Before escalation, it MUST record the requested resources and compare them with the effective sandbox boundary.
- An escalation decision MUST cite observable evidence of a real boundary crossing or a documented policy requirement.
- Helper startup, wrapper execution, sandbox initialization, approval timeout, and host namespace failures MUST be classified separately from target-resource permission denial.
- The agent MUST correlate repeated failures using a stable failure signature.
- If an escalated retry reproduces the same failure signature, the system MUST open a circuit breaker for that signature instead of escalating again automatically.
- Auto-review calls for one failure signature MUST be bounded; default maximum is 2 decisions per task unless a human explicitly resets the budget.
- Approval success MUST NOT be treated as remediation success without verifying the original operation and failure signature.
- Unknown root cause MUST result in bounded diagnosis, not repeated permission expansion.
- Safe in-boundary fallbacks SHOULD be tested before escalation when they preserve correctness and security.
- Human approval MUST remain mandatory for dangerous or irreversible permission expansion required by policy.
- The system MUST NOT weaken sandboxing merely to reduce latency, quota consumption, or diagnostic friction.
- Completion MUST be blocked when the decision record lacks Facts, Evidence, Decision, and Verification status.
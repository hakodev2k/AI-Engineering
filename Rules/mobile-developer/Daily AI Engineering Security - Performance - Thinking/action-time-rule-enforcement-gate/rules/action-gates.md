# Action-Time Gate Rules

- Hard procedural rules MUST be represented separately from preferences.
- Every hard gate MUST declare: `id`, action match criteria, required evidence keys, evidence freshness, failure behavior, and whether human approval is required.
- A governed action MUST NOT execute until all matching hard gates are evaluated.
- Missing or stale required evidence MUST block the action; it MUST NOT be converted into an assumption.
- Evidence MUST refer to observable facts such as command exit code, artifact hash, timestamp, test result, file state, or explicit human approval.
- The system MUST NOT request hidden chain-of-thought as evidence.
- Re-reading an instruction file MUST NOT by itself satisfy an operational precondition such as build/test/approval.
- A changed artifact, environment, branch, launcher, or relevant configuration SHOULD invalidate dependent evidence.
- Gate retries MUST be bounded. Maximum default retries: 2 unless the rule explicitly defines a lower value.
- A retry MUST add new evidence or a materially changed action; identical retries without state change MUST stop.
- Rules that cannot be deterministically evaluated MUST return `review`, not implicit allow.
- Human approval requirements MUST NOT be weakened for latency or convenience.
- Gate logs SHOULD contain gate ID, action ID, evidence keys and decision; they MUST NOT expose secrets or private reasoning.

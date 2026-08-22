# Engineering Rules

## MUST
- Every approval, denial, stop, interrupt, or cancellation event MUST carry `session_id`, `request_id`, `source`, `timestamp`, and `action`.
- Human intent MUST be attributed only when `source=human` and the decision maps to a live request in the same session.
- When a provider supplies `tool_use_id`, request and decision MUST match it exactly.
- Automated/background/system events MUST remain explicitly non-human.
- Ambiguous provenance MUST block human attribution and emit a neutral correction message.
- Cross-session, orphan, conflicting, or stale decisions MUST fail verification.
- Reconciliation MUST be bounded to at most one retry before escalation.
- The implementation agent MUST NOT be the sole verifier for changes to approval logic.
- Decision logs MUST preserve provenance metadata without secrets or raw sensitive tool payloads.

## MUST NOT
- MUST NOT convert timeout, queue preemption, background completion, transport closure, watchdog, or runtime cancellation into “the user denied/stopped”.
- MUST NOT correlate decisions only by tool name, arguments, timing, UI order, or “latest request”.
- MUST NOT reuse approval from another session unless a product explicitly defines a separately verified reusable grant contract.
- MUST NOT silently choose between conflicting decisions.
- MUST NOT keep retrying permission requests indefinitely.

## SHOULD
- Prefer provider-authored request/call identifiers.
- Store hashes or normalized metadata instead of full sensitive tool inputs when possible.
- Record `reason_code` separately from user-facing text.
- Expose verified states: `pending`, `verified_human_approve`, `verified_human_deny`, `non_human_cancel`, `ambiguous`, `expired`.
- Measure phantom-human-attribution rate and verified-decision coverage.

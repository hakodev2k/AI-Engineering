# Engineering Rules

## MUST
- Every permission-gated action MUST have a stable unique `request_id` before waiting.
- Every request MUST have exactly one terminal state: approved, denied, expired, or cancelled.
- The system MUST distinguish `requested`, `surfaced`, and terminal decision state.
- Surface timeout and decision timeout MUST be separate measurements.
- A subagent request MUST identify its parent/controller route when parent-mediated approval is required.
- Timeout MUST fail closed: deny, cancel, or escalate according to explicit policy.
- Delivery retries MUST retry only delivery of the approval request, never the gated side effect.
- Recovery MUST verify that the gated action did not execute before retrying orchestration.
- Approval lifecycle logs MUST include timestamps and correlation IDs but MUST redact sensitive command/input payloads.
- A request that cannot be correlated MUST stop the affected gated workflow.
- The implementation agent MUST NOT be the sole verifier for changes to permission-routing behavior.

## MUST NOT
- MUST NOT convert silence, UI absence, timeout, disconnect, or transport error into approval.
- MUST NOT represent a still-pending request as user denial unless policy actually executes an explicit deny transition.
- MUST NOT disable sandboxing, approvals, or permission checks merely to recover liveness.
- MUST NOT use unlimited waiting or unlimited notification retries.
- MUST NOT emit a second terminal decision for the same request.
- MUST NOT resume a blocked side effect while its approval state is ambiguous.
- MUST NOT log full secret-bearing command arguments solely for watchdog diagnostics.

## SHOULD
- Approval surfaces SHOULD acknowledge receipt separately from user decision when supported.
- Hosts SHOULD expose p50/p95 surface and decision latency independently.
- Background execution SHOULD know whether an attended decision surface exists before dispatching approval-gated work.
- Multi-agent controllers SHOULD centralize permission routing or explicitly proxy child requests.
- UIs SHOULD display pending age and originating agent/tool.
- Incidents SHOULD retain a minimal event ledger sufficient to reconstruct state transitions.
- Test suites SHOULD include lost-surface, orphan-event, duplicate-terminal, child-route, and slow-human fixtures.

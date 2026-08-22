# Rules: Interrupt Control-Plane Invariants

1. User stop/abort/corrective interrupts **MUST** be represented as control-plane events, not ordinary conversational messages queued behind active work.
2. Every interrupt **MUST** carry a monotonic epoch or equivalent sequence that cannot be confused with stale cancellation state.
3. The system **MUST** acknowledge interrupt receipt within the configured deadline and **MUST** separately record when cancellation becomes effective.
4. Cancellation **MUST** propagate to all owned active descendants: model calls, tools, subprocesses, background tasks, and subagents.
5. Every side-effect-capable adapter **MUST** re-check the current cancellation epoch immediately before admitting the side effect.
6. No new side effect **MUST** be admitted after cancellation is pending for the owning run.
7. Cancellation **MUST NOT** be considered complete while owned descendants remain active beyond the configured grace period.
8. Interrupted tool calls **MUST** leave a structurally valid terminal representation; transcript persistence **MUST NOT** create orphaned tool-call/result pairs or invalid role ordering.
9. Resume logic **MUST** reconcile the durable canceled state before scheduling prior unfinished work.
10. Canceled work **MUST NOT** be automatically replayed unless a new explicit user instruction authorizes that work.
11. UI/gateway acknowledgement **MUST NOT** be treated as proof that the worker stopped.
12. Hard process termination **SHOULD** be a bounded fallback after cooperative cancellation, and the resulting partial side effects **MUST** be recorded as ambiguous until reconciled.
13. Observable event logs **MUST** contain run ID, execution ID, parent ID, interrupt epoch, event type, monotonic timestamp, and side-effect admission identity where relevant.
14. Raw hidden reasoning **MUST NOT** be requested or logged as verification evidence.
15. Recovery loops **MUST** be bounded; the same failed cancellation hypothesis **MUST NOT** be retried more than twice without new evidence.
16. Performance optimization **MUST NOT** weaken interrupt priority, cancellation propagation, side-effect fencing, transcript integrity, or resume safety.

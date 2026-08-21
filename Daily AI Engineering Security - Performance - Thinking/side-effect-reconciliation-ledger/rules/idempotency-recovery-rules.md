# Idempotency and Recovery Rules

## MUST
- Classify every tool call as read-only or side-effecting before retry policy is selected.
- Assign a stable logical operation key before a side-effecting dispatch.
- Persist `prepared` and `dispatched` states outside model context.
- Treat timeout/disconnect/tool error after dispatch as `unknown-after-dispatch` unless non-application is proven.
- Reconcile durable downstream state before retrying an unknown mutation.
- Reuse an idempotency key when the downstream API documents safe replay semantics.
- Record readback evidence and downstream identifiers.
- Bound automatic reconciliation attempts.
- Escalate unresolved ambiguity instead of looping.

## MUST NOT
- Equate caller-visible failure with mutation failure.
- Blindly retry write/create/send/delete/approve/deploy actions.
- Generate a fresh logical operation key merely because transport failed.
- Rely only on conversation memory for operation state.
- perform compensating deletion automatically when duplicate state is uncertain.
- hide duplicate incidents by overwriting ledger history.

## SHOULD
- Prefer APIs with native idempotency keys or conditional writes.
- Design downstream records with stable correlation metadata where possible.
- Make readback narrower than broad list scans.
- Alert on `unknown-after-dispatch` records older than the integration's normal consistency window.
- Measure prevented retries and duplicate rate.
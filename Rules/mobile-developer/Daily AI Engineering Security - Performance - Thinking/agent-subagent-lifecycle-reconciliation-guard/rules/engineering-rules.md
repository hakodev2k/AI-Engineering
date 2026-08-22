# Engineering Rules

## MUST
- **MUST** preserve lifecycle evidence source identity; do not collapse terminal events, registry state, cache state, and UI labels into one unqualified string.
- **MUST** apply the configured evidence precedence before any lifecycle-dependent orchestration decision.
- **MUST** treat `terminal_event`, `task_complete_event`, and authoritative registry responses as stronger evidence than watched/UI status.
- **MUST** reject terminal→active resurrection for the same execution ID unless policy explicitly allows it.
- **MUST** record a new execution/attempt ID for legitimate retries or replacements.
- **MUST** run reconciliation before parent completion when required children exist.
- **MUST** bound status/wait loops by both attempt count and time budget.
- **MUST** measure stale-active age when timestamps are available.
- **MUST** distinguish `implemented`, `measured`, and `verified` in completion reports.
- **MUST** surface unresolved lifecycle conflict rather than silently choosing the most convenient state.
- **MUST** preserve delivered child results even when presentation state is stale.
- **MUST** use deterministic reconciliation for state precedence; do not ask the model to improvise precedence rules each turn.

## MUST NOT
- **MUST NOT** treat a UI badge or cached watched status as authoritative by itself.
- **MUST NOT** spawn replacement work solely because a child visually appears stuck.
- **MUST NOT** keep polling indefinitely or increase polling frequency in response to uncertainty.
- **MUST NOT** mark a genuinely unresolved required child as completed merely to unblock the parent.
- **MUST NOT** reopen/replay completed child work unless a retry decision creates a distinct execution identity.
- **MUST NOT** infer lifecycle completion from natural-language commentary without a corresponding lifecycle/result signal.
- **MUST NOT** let the implementing agent be the sole verifier of high-impact lifecycle changes.
- **MUST NOT** erase contradictory evidence from logs; preserve the minimal facts needed for diagnosis.

## SHOULD
- **SHOULD** prefer event-driven child completion over frequent polling where the platform supports it.
- **SHOULD** use exponential or bounded backoff for long-running children.
- **SHOULD** persist normalized reconciliation snapshots so restart/resume can be checked against the last trusted state.
- **SHOULD** keep UI/presentation status separately labeled from runtime/registry status.
- **SHOULD** alert when stale-active age crosses policy rather than forcing a model turn for every timeout.
- **SHOULD** track status-query count and context/token cost attributable to orchestration.
- **SHOULD** test rehydration, restart, result-delivery, and retry transitions explicitly.

## State invariants
1. A terminal state is monotonic for a given execution ID.
2. A retry is a new execution identity, not a mutation of terminal history.
3. Result delivery does not automatically imply success, but it is evidence that the child is no longer merely `queued`.
4. Parent completion depends on required deliverables and reconciled child state, not presentation state.
5. Unknown/conflicting state is explicit and blocks irreversible lifecycle decisions.
6. Every wait loop has a maximum attempts/time budget and a failure path.

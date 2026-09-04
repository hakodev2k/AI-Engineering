# Rules: Single-Writer Turn Policy

- A session MUST have at most one active mutation-capable lease.
- Every mutation-capable turn MUST present the current lease epoch.
- Lease epochs MUST increase monotonically when mutation ownership changes.
- A worker presenting an older epoch MUST be rejected before any state mutation or external side effect.
- Every logical mutation operation MUST carry a stable unique operation ID across retries.
- The runtime MUST NOT treat a client timeout as proof that server-side execution stopped.
- A retry after uncertain completion MUST reconcile terminal/server state before starting a replacement mutation turn.
- A background wake/delegation path MUST use the same lease and fencing checks as foreground prompts.
- Read-only followers MAY observe without a mutation lease only when the host can enforce read-only behavior.
- UI owner/follower state MUST NOT be the sole authorization source for mutation.
- Lease revocation MUST be durable before a new epoch is granted.
- Transcript append, checkpoint writes, tool-result association, and external side-effect dispatch SHOULD be fenced at the same epoch boundary.
- A worker MUST NOT self-approve a stale-epoch override.
- Any override that can permit concurrent mutation MUST require explicit human/operator approval and MUST be logged.
- Completion MUST be blocked while an unresolved ambiguous turn remains unless reconciliation proves it is terminal or safely fenced.
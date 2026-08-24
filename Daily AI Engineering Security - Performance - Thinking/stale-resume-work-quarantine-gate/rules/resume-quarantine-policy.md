# Rules — Resume Quarantine Policy

1. Auto-resume freshness MUST be based on semantic activity provenance, not a generic storage `updated_at` field.
2. A restore/reconciliation write MUST NOT refresh the timestamp used to prove user/task recency.
3. `pending` or `undelivered` state MUST NOT by itself authorize autonomous execution.
4. Completed, cancelled, or explicitly stopped tasks MUST NOT become active work after restart without a new explicit activation event.
5. Work older than the configured freshness window MUST be quarantined before any model or tool execution.
6. Missing or ambiguous provenance MUST result in quarantine, not optimistic resume.
7. Stale side-effect-capable work MUST require explicit human re-approval before mutation.
8. Historical completion payloads MAY be surfaced as reference-only context but MUST NOT be converted into a fresh active user/task turn.
9. Resume decisions MUST record task/session identity, semantic activity timestamp, age, prior terminal state, side-effect class, decision, and reason codes.
10. Approval from a prior execution epoch SHOULD be revalidated when the workspace, branch, credentials, environment, or external target has changed.
11. Recovery retries MUST be bounded; default maximum is 2 reconstruction attempts before escalation.
12. Quarantine logic MUST be deterministic and MUST NOT invoke an LLM to decide whether stale work is safe to resume.
13. A resume implementation MUST preserve existing permission/sandbox boundaries and MUST NOT weaken them to restore liveness.

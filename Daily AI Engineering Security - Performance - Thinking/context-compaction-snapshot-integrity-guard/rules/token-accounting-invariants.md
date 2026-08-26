# Rules: Token Accounting Invariants

- A compaction decision **MUST** use a fresh current-prompt or last-call-prompt snapshot.
- Cumulative billed/session usage **MUST NOT** be used as current context occupancy.
- Every snapshot **MUST** carry source semantics and turn identity.
- The effective capacity used by preflight enforcement **MUST** match the capacity used by compaction logic within the configured tolerance.
- Reserve tokens **MUST** be subtracted before utilization is compared with the compaction threshold.
- A stale, future-dated, impossible, or semantically ambiguous snapshot **MUST** block automatic compaction.
- Required correctness context **MUST NOT** be removed solely to reduce token usage.
- Token counters **SHOULD** be logged as structured fields with units and scope; secrets and prompt contents **MUST NOT** be logged by this package.
- Before/after token, latency, and task-quality measurements **MUST** be captured before declaring an optimization verified.

# Resume Integrity Rules

- A persisted session **MUST** be scanned for unmatched tool calls before resumed model execution.
- A missing tool result **MUST NOT** be interpreted as tool failure; the outcome is unknown until evidence establishes it.
- A runtime **MUST NOT** fabricate a successful result to make transcript structure valid.
- A state-changing call with unknown outcome **MUST NOT** be retried unless idempotency or authoritative side-effect evidence makes retry safe.
- Tool-call IDs **MUST** be unique within the scanned history; duplicate IDs **MUST** block normal resume.
- Result records without a corresponding call **MUST** be reported as integrity anomalies.
- Recovery **MUST** preserve the original transcript and evidence before modification or forking.
- Evidence collection/reconciliation **MUST** be bounded to two retries.
- A recovered result **MUST** be derived from authoritative durable evidence and record its provenance.
- If exact recovery is impossible, the workflow **MUST** fork from the last verified checkpoint instead of weakening validation.
- High-risk recovery **MUST** be independently verified before mutations resume.
- Teams **SHOULD** measure corrupt resumes caught, retries avoided, duplicate side effects, usage waste, and rework.

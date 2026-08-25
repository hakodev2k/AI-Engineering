# Context Recovery Rules

- A long-context workflow **MUST** reserve tokens for final tool results, verification, and recovery state export.
- A runtime **MUST NOT** treat prompt-cache reuse as guaranteed capacity.
- Repeated transport failures on an oversized context **MUST NOT** be retried unless a material condition changes.
- Compaction **MUST NOT** be assumed available after the same oversized uncached request path repeatedly fails.
- Goals, facts, decisions, approvals, pending side effects, workspace identity, and verification status **MUST** be exported before abandoning a session.
- Unknown cache health **MUST NOT** be reported as healthy.
- Correctness-critical context **MUST NOT** be removed merely to save tokens.
- Recovery retries **MUST** be bounded to two telemetry refreshes.
- A fresh-session recovery **MUST** verify imported state before mutations resume.
- Teams **SHOULD** compare tokens/task, retry count, latency, cache hit ratio, and quality regressions before and after adoption.

# Resume Context Budget Rules

- A resumed session **MUST** preserve the active goal, acceptance criteria, security constraints, branch/workspace identity, unresolved failures, and relevant approvals.
- Resume optimization **MUST NOT** remove context required for correctness merely to reduce tokens.
- Static context **MUST** be deduplicated before transmission when equivalent copies can be identified deterministically.
- Tool-derived facts **MUST** carry freshness/provenance or be revalidated before they influence a destructive/high-impact action.
- Historical tool output, old logs, and resolved failures **SHOULD** be lazy-loaded unless directly relevant.
- A resume **MUST** estimate token load before execution when source sizes are available.
- If estimated input exceeds the configured budget, the workflow **MUST** produce a rehydration plan rather than silently truncating.
- Rediscovery calls **MUST** be bounded by `max_rediscovery_calls`.
- Resume quality **MUST** be compared with a full-context reference fixture before claiming token improvement.
- Estimated and actual token usage **SHOULD** be recorded separately from cache-read/cache-write telemetry when available.
- A summary **MUST NOT** replace a critical source unless its critical fields are explicitly verified.

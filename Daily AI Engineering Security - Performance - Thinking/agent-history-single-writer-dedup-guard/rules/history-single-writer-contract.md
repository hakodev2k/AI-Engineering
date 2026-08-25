# Rules: History Single-Writer Contract

- Each conversation/session scope **MUST** have exactly one authoritative append writer at a time.
- Secondary components **MUST** be explicitly `observer`, `loader`, `replace-owner`, or `disabled`; they **MUST NOT** silently append the same logical messages.
- Every logical message **MUST** receive a stable identity before persistence and **SHOULD** preserve it through transport and middleware transformations.
- An append operation **MUST** contain only messages not already durably committed for that conversation scope.
- Persistence layers **MUST** reject or idempotently ignore a second append of the same stable message ID; they **MUST NOT** create another durable row/copy.
- Full-history snapshots and append deltas **MUST** be distinguishable by contract, not inferred only from list shape.
- Service-managed-history metadata **MUST** survive streaming wrappers and response reconstruction when later control flow depends on it.
- Deduplication **MUST NOT** use text equality as the sole basis for deleting model context.
- Before optimization, teams **MUST** record baseline token usage and append amplification; after changes they **MUST** measure the same workload again.
- Lower token usage **MUST NOT** count as success if required context, tool-call/result pairing, or task quality regresses.
- Duplicate history failures **MUST** be fixed at the earliest ownership/commit boundary rather than hidden only by downstream compaction.
- Repair loops **MUST** be bounded to two hypothesis-driven iterations.